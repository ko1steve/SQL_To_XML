import { CommandType, ErrorType, GroupType, IElementConifg, IGroupContainerConfig, IGroupSetting, MainConfig } from "src/config";

export class TabContent {

  protected mainConfig: MainConfig
  protected commandType: CommandType = CommandType.NONE
  protected textFromFileLoaded: string

  protected commandValidMap: Map<CommandType, boolean> = new Map([
    [
      CommandType.DML, true
    ],
    [
      CommandType.DDL, true
    ]
  ])

  protected commandGroupMap: Map<GroupType, CommandData[]>

  constructor(commandType: CommandType, textFromFileLoaded: string) {
    console.error('constructor : ' + commandType);
    this.commandType = commandType
    this.textFromFileLoaded = textFromFileLoaded
    this.initConfig()
    this.getCommandGroup()
    this.createContent()
  }

  protected initConfig(): void {
    this.mainConfig = new MainConfig()
    this.commandValidMap.set(this.commandType, true)
  }

  protected getCommandGroup(): void {
    const textLinesGroupMap: Map<string, string> = this.getTextGroupMap(this.textFromFileLoaded)
    this.commandGroupMap = this.getCommandGroupMap(textLinesGroupMap, this.commandType)
  }

  protected createContent(): void {
    const mainContainer: HTMLDivElement = document.getElementById('content-with-upload-' + this.commandType) as HTMLDivElement
    const elementConfig: IElementConifg = this.mainConfig.elementConfigMap.get(this.commandType) as IElementConifg
    this.createPageContent(mainContainer, this.commandGroupMap, elementConfig)
  }

  public resetPageContent(textFromFileLoaded: string): void {
    const mainContainer: HTMLDivElement = document.getElementById('content-with-upload-' + this.commandType) as HTMLDivElement
    const contentContainer: HTMLDivElement = document.getElementById('content-container-' + this.commandType) as HTMLDivElement
    if (contentContainer == null) {
      return
    }
    mainContainer.removeChild(contentContainer)
    this.textFromFileLoaded = textFromFileLoaded
    this.getCommandGroup()
    this.createContent()
  }

  protected getTextGroupMap(textFromFileLoaded: string): Map<string, string> {
    const textLinesGroupMap: Map<string, string> = new Map<string, string>()
    const textLines: string[] = textFromFileLoaded.split('\n')
    let isGroupToMap = false
    let groupName: GroupType | null
    for (let i = 0; i < textLines.length; i++) {
      isGroupToMap = false

      //* 若找不到區塊分割的判斷字串，則略過
      groupName = this.getGroupName(textLines[i])
      if (groupName === null) {
        continue
      }
      const searchEndArr: string[] = this.mainConfig.groupSettingMap.get(groupName)?.searchEndPattern as string[]
      let text = ''

      //* 找到區塊分割的判斷字串後，尋找區塊的結束點
      let j: number
      for (j = i + 1; j < textLines.length; j++) {
        i = j - 1
        for (let k = 0; k < searchEndArr.length; k++) {
          if (textLines[j].trim().startsWith(searchEndArr[k])) {
            //* 找到結束點後，將整個區塊指令儲存至 Map
            textLinesGroupMap.set(groupName, text)
            isGroupToMap = true
            break
          }
        }
        if (isGroupToMap) {
          break
        }
        //* 找到結束點之前，不斷累加該行的指令文字
        text += textLines[j] + '\n'
      }
      //* 如果直到最後都沒有出現結束點文字，則判斷結束點為最後一行文字
      if (j === textLines.length) {
        textLinesGroupMap.set(groupName, text)
        isGroupToMap = true
        break
      }
    }
    return textLinesGroupMap
  }

  protected isIgnoreCommand(text: string): boolean {
    text = text.trim()
    if (text.endsWith(';')) {
      text = text.substring(0, text.length - 1)
    }
    return this.mainConfig.ignoredCommands.includes(text.toUpperCase())
  }

  protected isValidCommand(text: string): boolean {
    text = text.trim()
    if (text.endsWith(';')) {
      text = text.substring(0, text.length - 1)
    }
    let result = true
    this.mainConfig.invalidCommands.forEach(e => {
      if (text.toUpperCase().indexOf(e) > -1) {
        result = false
      }
    })
    return result
  }

  protected getCommandGroupMap(textLinesGroupMap: Map<string, string>, commandType: CommandType): Map<GroupType, CommandData[]> {
    const commandGroupMap = new Map<GroupType, CommandData[]>()
    textLinesGroupMap.forEach((text: string, groupName: GroupType) => {
      const textLines = text.split('\n')
      const commamds: CommandData[] = []
      for (let i = 0; i < textLines.length; i++) {
        let isAddToMap = false
        let isCommandValid = true;

        //* 若找不到指令分割的判斷字串，則略過
        if (!textLines[i].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
          continue
        }
        let commandText: string = ''
        const newTextLine: string = textLines[i].replace(this.mainConfig.singleCommandIndicator, '').trim()

        //* 判斷指令是不是該忽略 
        if (newTextLine.length !== 0 && !this.isIgnoreCommand(newTextLine)) {
          isCommandValid = this.isValidCommand(newTextLine)
          commandText = newTextLine + '\n'
        }
        //* 找到指令分割的判斷字串後，尋找指令的結束點
        let j: number
        for (j = i + 1; j < textLines.length; j++) {
          i = j - 1
          if (textLines[j].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
            commandText = this.cleanEmptyLineAtCommandEnd(commandText)
            if (commandText.length > 0) {
              const commandStatus: CommandStatus = isCommandValid ? CommandStatus.valid : CommandStatus.invalid
              commamds.push(new CommandData(commandText, commandStatus))
              commandGroupMap.set(groupName, commamds)
              if (!isCommandValid) {
                this.commandValidMap.set(commandType, false)
              }
            }
            isAddToMap = true
            break
          } else if (!this.isIgnoreCommand(textLines[j])) {
            textLines[j] = textLines[j].replace(this.mainConfig.singleCommandIndicator, '')
            if (textLines[j].trim().length > 0) {
              isCommandValid = this.isValidCommand(textLines[j])
              //* 找到結束點之前，不斷累加指令的內容
              commandText += textLines[j] + '\n'
            }
          }
          if (isAddToMap) {
            break
          }
        }
        //* 如果直到最後都沒有出現結束點文字，則判斷結束點為最後一行文字
        if (j === textLines.length) {
          commandText = this.cleanEmptyLineAtCommandEnd(commandText)
          if (commandText.length > 0) {
            const commandStatus: CommandStatus = isCommandValid ? CommandStatus.valid : CommandStatus.invalid
            commamds.push(new CommandData(commandText, commandStatus))
            commandGroupMap.set(groupName, commamds)
          }
          isAddToMap = true
          break
        }
      }
    })
    return commandGroupMap
  }

  protected cleanEmptyLineAtCommandEnd(commandText: string): string {
    while (commandText.endsWith('\n')) {
      const i: number = commandText.lastIndexOf('\n')
      commandText = commandText.substring(0, i).trim()
    }
    return commandText;
  }

  protected getGroupName(textLine: string): GroupType | null {
    const groupNames: GroupType[] = Array.from(this.mainConfig.groupSettingMap.keys())
    const groupSetting: IGroupSetting[] = Array.from(this.mainConfig.groupSettingMap.values())
    for (let i = 0; i < groupSetting.length; i++) {
      if (textLine.trim().startsWith(groupSetting[i].indicator)) {
        return groupNames[i]
      }
    }
    return null
  }

  protected createPageContent(mainContainer: HTMLDivElement, commandGroupMap: Map<GroupType, CommandData[]>, elementConfig: IElementConifg): void {
    const contentContainer: HTMLDivElement = document.createElement('div') as HTMLDivElement
    contentContainer.id = 'content-container-' + this.commandType
    mainContainer.appendChild(contentContainer)

    const config = elementConfig.allGroupContainer

    this.mainConfig.groupShowOrder.forEach(groupType => {
      let commands: CommandData[] = []
      if (commandGroupMap.has(groupType)) {
        commands = commandGroupMap.get(groupType) as CommandData[]
      }
      const allGroupContainer: HTMLDivElement = document.createElement('div') as HTMLDivElement
      allGroupContainer.id = config.id
      allGroupContainer.className = config.className
      contentContainer.appendChild(allGroupContainer)
      this.createGroupContainer(groupType, commands, allGroupContainer, elementConfig)
    })

    const isValid: boolean = this.commandValidMap.has(this.commandType) && (this.commandValidMap.get(this.commandType) as boolean)
    if (isValid) {
      this.createDownloadButton(contentContainer, elementConfig)
    }
  }

  protected createGroupContainer(groupType: GroupType, commands: CommandData[], parent: HTMLElement, elementConfig: IElementConifg): void {
    const config: IGroupContainerConfig = elementConfig.allGroupContainer.groupContainer;

    const groupContainer: HTMLDivElement = document.createElement('div')
    groupContainer.id = config.id
    groupContainer.className = config.className
    parent.appendChild(groupContainer)

    const warningMessageContainer = document.createElement('div')
    warningMessageContainer.id = config.warningMessageContainer.id
    warningMessageContainer.className = config.warningMessageContainer.className
    groupContainer.appendChild(warningMessageContainer)
    this.addClassName(warningMessageContainer, 'invisble')

    const commandContainer = document.createElement('div')
    commandContainer.id = config.commandContainer.id.replace('{groupType}', groupType)
    commandContainer.className = config.commandContainer.className
    groupContainer.appendChild(commandContainer)

    const errorMessageContainer: HTMLDivElement = document.createElement('div')
    errorMessageContainer.id = config.errorMessageContainer.id
    errorMessageContainer.className = config.errorMessageContainer.className
    groupContainer.appendChild(errorMessageContainer)

    const title = document.createElement('p')
    title.id = config.commandContainer.title.id.replace('{groupType}', groupType)
    title.className = config.commandContainer.title.className
    title.innerText = this.mainConfig.groupSettingMap.get(groupType)?.title as string
    commandContainer.appendChild(title)

    if (commands.length === 0) {
      let errorMessage: string = this.mainConfig.errorMessageMap.get(ErrorType.CONTENT_NOT_FOUND_ERROR) as string
      errorMessage = errorMessage.replace('{groupType}', groupType)
      this.addClassName(title, 'command-invalid')
      this.commandValidMap.set(this.commandType, false)
      const span: HTMLSpanElement = document.createElement('span')
      span.className = config.errorMessageContainer.errorMessage.className
      span.innerText = errorMessage
      errorMessageContainer.appendChild(span)
      return
    }
    this.addClassName(errorMessageContainer, 'invisble')
    const orderedList = document.createElement('ol')
    commandContainer.appendChild(orderedList)

    commands.forEach((command: CommandData, index: number) => {
      const listItem = document.createElement('li')
      if (command.status === CommandStatus.invalid) {
        this.addClassName(listItem, 'command-invalid')
      }
      listItem.addEventListener('pointerover', () => {
        this.addClassName(listItem, 'pointerover-command')
      });
      listItem.addEventListener('pointerout', () => {
        this.removeClassName(listItem, 'pointerover-command')
      });
      orderedList.appendChild(listItem)

      const paragraph = document.createElement('p')
      paragraph.id = config.commandContainer.paragraph.id.replace('{groupType}', groupType).replace('{index}', index.toString())
      paragraph.className = config.commandContainer.paragraph.className
      paragraph.innerText = command.content
      listItem.appendChild(paragraph)
    })
  }

  protected createDownloadButton(parent: HTMLElement, elementConfig: IElementConifg): void {
    const config = elementConfig.downloadButtonContainer
    const container = document.createElement('div')
    container.id = config.id
    container.className = config.className
    const button = document.createElement('button')
    button.className = config.downloadButton.className
    if (config.downloadButton.textContent) {
      button.textContent = config.downloadButton.textContent
    }
    button.onclick = () => {
      // downloadXML()
    }
    container.appendChild(button)
    parent.appendChild(container)
  }

  // function downloadXML (): void {
  //   let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n'
  //   xmlContent += '<data>\n'
  //   fieldCountArr.forEach((count, groupIndex) => {
  //     xmlContent += '  <group index="' + groupIndex + '">\n'
  //     for (let i = 0; i < count; i++) {
  //       // var valueId = 'field' + (groupIndex + 1) + '-' + (i+1)
  //       // xmlContent += '    <item index="' + i + '">' + document.getElementById(valueId).value + '</item>\n'
  //     }
  //     xmlContent += '  </group>\n'
  //   })
  //   xmlContent += '</data>\n'

  //   const blob = new Blob([xmlContent], { type: 'text/xml' })
  //   const a = document.createElement('a')
  //   a.href = URL.createObjectURL(blob)
  //   a.download = 'data.xml'
  //   document.body.appendChild(a)
  //   a.click()
  //   document.body.removeChild(a)
  // }

  protected addClassName(element: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(className => element.className += ' ' + className)
  }

  protected removeClassName(element: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(className => element.className = element.className.replace(className, '').trim())
  }

}

export enum CommandStatus {
  valid = 'valid',
  invalid = 'invalid',
  ignored = 'ignored'
}

export interface ICommandData {
  content: string
  status: CommandStatus
}

export class CommandData implements ICommandData {

  protected _content: string;
  protected _status: CommandStatus;

  constructor(content: string, status = CommandStatus.valid) {
    this._content = content;
    this._status = status;
  }

  public get content(): string {
    return this._content
  }

  public get status(): CommandStatus {
    return this._status
  }
}