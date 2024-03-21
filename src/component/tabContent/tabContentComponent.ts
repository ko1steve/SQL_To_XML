import { CommandType, GroupType, IGroupSetting, MainConfig } from 'src/mainConfig'
import { IGroupContainerConfig, ITabContentConfig } from './tabContentConfig'
import { CommandData, MessageType, ICommandDataDetail } from 'src/element/CommandData'

export class TabContentComponent {
  protected mainConfig: MainConfig = new MainConfig()
  protected commandType: CommandType = CommandType.NONE
  protected textFromFileLoaded: string

  protected commandValid: boolean = true

  protected commandGroupMap: Map<GroupType, CommandData[]> = new Map()

  constructor (commandType: CommandType, textFromFileLoaded: string) {
    this.commandType = commandType
    this.textFromFileLoaded = textFromFileLoaded
    this.commandValid = true
    this.getCommandGroup()
    this.createContent()
  }

  protected getCommandGroup (): void {
    const textLinesGroupMap: Map<GroupType, string> = this.getTextGroupMap(this.textFromFileLoaded)
    this.commandGroupMap = this.getCommandGroupMap(textLinesGroupMap)
  }

  protected createContent (): void {
    const mainContainer: HTMLDivElement = document.getElementById('main-container-' + this.commandType) as HTMLDivElement
    const elementConfig: ITabContentConfig = this.mainConfig.tabContentConfigMap.get(this.commandType) as ITabContentConfig
    this.createPageContent(mainContainer, this.commandGroupMap, elementConfig)
  }

  public resetPageContent (textFromFileLoaded: string): void {
    const mainContainer: HTMLDivElement = document.getElementById('main-container-' + this.commandType) as HTMLDivElement
    const contentContainer: HTMLDivElement = document.getElementById('content-container-' + this.commandType) as HTMLDivElement
    if (contentContainer == null) {
      return
    }
    mainContainer.removeChild(contentContainer)
    this.textFromFileLoaded = textFromFileLoaded
    this.getCommandGroup()
    this.createContent()
  }

  protected getTextGroupMap (textFromFileLoaded: string): Map<GroupType, string> {
    const textLinesGroupMap: Map<GroupType, string> = new Map<GroupType, string>()
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
        if (this.commandType === CommandType.DML) {
          textLines[j] = this.cleanSemicolon(textLines[j])
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

  protected getCommandDataDetail (text: string): ICommandDataDetail {
    text = text.trim()
    if (text.endsWith(';')) {
      text = text.substring(0, text.length - 1)
    }
    const detail: ICommandDataDetail = {
      messageType: MessageType.NONE,
      commands: []
    }
    //* 檢查指令是否包含不合規的語法
    this.mainConfig.invalidCommands.forEach(e => {
      if (text.toUpperCase().indexOf(e) > -1) {
        detail.messageType = MessageType.INVALID_COMMAND_ERROR
        detail.commands.push(e)
      }
    })
    //* 若是不存在不合規的語法，則檢查指令是否包含需略過的語法
    if (detail.commands.length === 0) {
      this.mainConfig.ignoredCommands.forEach(e => {
        if (text.toUpperCase().indexOf(e) > -1) {
          detail.messageType = MessageType.IGNORED_COMMAND
          detail.commands.push(e)
        }
      })
    }
    return detail
  }

  /**
   * Split the raw text to five command groups (PreSQL , CountSQL , SelectSQL , MainSQL , PostSQL)
   * @param textLinesGroupMap
   * @returns Map<GroupType, CommandData[]>
   */
  protected getCommandGroupMap (textLinesGroupMap: Map<GroupType, string>): Map<GroupType, CommandData[]> {
    const commandGroupMap = new Map<GroupType, CommandData[]>()
    textLinesGroupMap.forEach((text: string, groupName: GroupType) => {
      const textLines = text.split('\n')
      const commamds: CommandData[] = []
      for (let i = 0; i < textLines.length; i++) {
        let isAddToMap = false
        let commandDataDetail: ICommandDataDetail = {
          messageType: MessageType.NONE,
          commands: []
        }

        //* 若找不到指令分割的判斷字串，則略過
        if (!textLines[i].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
          continue
        }
        let commandText: string = ''
        const newTextLine: string = textLines[i].replace(this.mainConfig.singleCommandIndicator, '').trim()

        //* 取得指令資料
        if (newTextLine.length !== 0) {
          commandDataDetail = this.getCommandDataDetail(newTextLine)
          commandText = newTextLine + '\n'
        }
        //* 找到指令分割的判斷字串後，尋找指令的結束點
        let j: number
        for (j = i + 1; j < textLines.length; j++) {
          i = j - 1
          if (textLines[j].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
            commandText = this.cleanEmptyLineAtCommandEnd(commandText)
            if (commandText.length > 0) {
              commamds.push(new CommandData(commandText, commandDataDetail))
              commandGroupMap.set(groupName, commamds)
            }
            isAddToMap = true
            break
          } else {
            textLines[j] = textLines[j].replace(this.mainConfig.singleCommandIndicator, '')
            if (textLines[j].trim().length > 0) {
              commandDataDetail = this.getCommandDataDetail(textLines[j])
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
            commamds.push(new CommandData(commandText, commandDataDetail))
            commandGroupMap.set(groupName, commamds)
          }
          isAddToMap = true
          break
        }
      }
    })
    return commandGroupMap
  }

  protected cleanSemicolon (commandText: string): string {
    const newText = commandText.trimEnd()
    if (newText.endsWith(';')) {
      return newText.substring(0, newText.length - 1)
    }
    return commandText
  }

  protected cleanEmptyLineAtCommandEnd (commandText: string): string {
    while (commandText.endsWith('\n')) {
      const i: number = commandText.lastIndexOf('\n')
      commandText = commandText.substring(0, i).trim()
    }
    return commandText
  }

  protected getGroupName (textLine: string): GroupType | null {
    const groupNames: GroupType[] = Array.from(this.mainConfig.groupSettingMap.keys())
    const groupSetting: IGroupSetting[] = Array.from(this.mainConfig.groupSettingMap.values())
    for (let i = 0; i < groupSetting.length; i++) {
      if (textLine.trim().startsWith(groupSetting[i].indicator)) {
        return groupNames[i]
      }
    }
    return null
  }

  protected createPageContent (mainContainer: HTMLDivElement, commandGroupMap: Map<GroupType, CommandData[]>, elementConfig: ITabContentConfig): void {
    const contentContainer: HTMLDivElement = document.createElement('div') as HTMLDivElement
    contentContainer.id = elementConfig.mainContainer.contentContainer.id
    mainContainer.appendChild(contentContainer)

    this.mainConfig.groupShowOrder.forEach(groupType => {
      let commands: CommandData[] = []
      if (commandGroupMap.has(groupType)) {
        commands = commandGroupMap.get(groupType) as CommandData[]
      }
      this.createGroupContainer(groupType, commands, contentContainer, elementConfig)
    })
    if (this.commandValid) {
      this.createDownloadButton(contentContainer, elementConfig)
    }
  }

  protected createGroupContainer (groupType: GroupType, commands: CommandData[], parent: HTMLElement, elementConfig: ITabContentConfig): void {
    const config: IGroupContainerConfig = elementConfig.groupContainer

    const groupContainer: HTMLDivElement = document.createElement('div')
    groupContainer.id = config.id.replace('{groupType}', groupType)
    groupContainer.className = config.className
    parent.appendChild(groupContainer)

    const warningMessageContainer = document.createElement('div')
    warningMessageContainer.id = config.warningMessageContainer.id.replace('{groupType}', groupType)
    warningMessageContainer.className = config.warningMessageContainer.className
    groupContainer.appendChild(warningMessageContainer)

    const commandContainer = document.createElement('div')
    commandContainer.id = config.commandContainer.id.replace('{groupType}', groupType)
    commandContainer.className = config.commandContainer.className
    groupContainer.appendChild(commandContainer)

    const errorMessageContainer: HTMLDivElement = document.createElement('div')
    errorMessageContainer.id = config.errorMessageContainer.id.replace('{groupType}', groupType)
    errorMessageContainer.className = config.errorMessageContainer.className
    groupContainer.appendChild(errorMessageContainer)

    const title = document.createElement('p')
    title.id = config.commandContainer.title.id.replace('{groupType}', groupType)
    title.className = config.commandContainer.title.className
    title.innerText = this.mainConfig.groupSettingMap.get(groupType)?.title as string
    commandContainer.appendChild(title)

    if (commands.length === 0) {
      this.commandValid = false
      let errorMessage: string = this.mainConfig.messageMap.get(MessageType.CONTENT_NOT_FOUND_ERROR) as string
      errorMessage = errorMessage.replace('{groupType}', groupType)
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType)?.title as string
      errorMessage = errorMessage.replace('{groupTitle}', groupTitle)
      this.addClassName(title, 'command-error')
      const span: HTMLSpanElement = document.createElement('span')
      span.className = config.errorMessageContainer.errorMessage.className
      span.innerText = errorMessage
      errorMessageContainer.appendChild(span)
    }
    const orderedList = document.createElement('ol')
    commandContainer.appendChild(orderedList)

    commands.forEach((command: CommandData, index: number) => {
      const listItem = document.createElement('li')
      listItem.className = 'command'
      if (command.detail.messageType !== MessageType.NONE) {
        this.appendMessage(command, groupType, index, config)
      }
      listItem.addEventListener('pointerover', () => {
        this.addClassName(listItem, 'pointerover-command')
      })
      listItem.addEventListener('pointerout', () => {
        this.removeClassName(listItem, 'pointerover-command')
      })
      orderedList.appendChild(listItem)

      const paragraph = document.createElement('p')
      paragraph.id = config.commandContainer.paragraph.id.replace('{groupType}', groupType).replace('{index}', index.toString())
      paragraph.innerText = command.content
      listItem.appendChild(paragraph)

      switch (command.detail.messageType) {
        case MessageType.IGNORED_COMMAND:
          this.addClassName(listItem, 'command-ignored')
          command.content = '-- ' + command.content
          break
        case MessageType.CONTENT_NOT_FOUND_ERROR:
        case MessageType.INVALID_COMMAND_ERROR:
          this.commandValid = false
          this.addClassName(listItem, 'command-error')
          break
      }
    })
    if (warningMessageContainer.children.length === 0) {
      this.addClassName(warningMessageContainer, 'invisible')
    }
    if (errorMessageContainer.children.length === 0) {
      this.addClassName(errorMessageContainer, 'invisible')
    }
  }

  protected appendMessage (command: CommandData, groupType: GroupType, index: number, config: IGroupContainerConfig): void {
    if (command.detail !== undefined) {
      let container: HTMLDivElement
      const paragraph: HTMLSpanElement = document.createElement('p')
      command.detail.commands.forEach(e => {
        let message: string = this.mainConfig.messageMap.get((command.detail as ICommandDataDetail).messageType) as string
        message = message.replace('{groupType}', groupType)
        message = message.replace('{index}', (index + 1).toString())
        message = message.replace('{command}', e)
        paragraph.innerText = message
        switch (command.detail.messageType) {
          case MessageType.IGNORED_COMMAND:
            paragraph.className = config.warningMessageContainer.warningMessage.className
            this.addClassName(paragraph, 'warning-message')
            container = document.getElementById(config.warningMessageContainer.id.replace('{groupType}', groupType)) as HTMLDivElement
            break
          case MessageType.INVALID_COMMAND_ERROR:
          case MessageType.CONTENT_NOT_FOUND_ERROR:
            paragraph.className = config.errorMessageContainer.errorMessage.className
            this.addClassName(paragraph, 'error-meesage')
            container = document.getElementById(config.errorMessageContainer.id.replace('{groupType}', groupType)) as HTMLDivElement
            break
        }
        container.appendChild(paragraph)
      })
    }
  }

  protected createDownloadButton (parent: HTMLElement, elementConfig: ITabContentConfig): void {
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

  protected addClassName (element: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(className => { element.className += ' ' + className })
  }

  protected removeClassName (element: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(className => { element.className = element.className.replace(className, '').trim() })
  }
}
