import { CommandType, GroupType, IGroupSetting, MainConfig } from 'src/mainConfig'
import { IGroupContainerConfig, ITabContentConfig } from './tabContentConfig'
import { CommandData, MessageType, ICommandDataDetail } from 'src/element/CommandData'
import { TSMap } from 'typescript-map'
import * as He from 'he'

export class TabContentController {
  protected mainConfig: MainConfig = new MainConfig()
  protected commandType: CommandType = CommandType.NONE
  protected textFromFileLoaded: string

  protected commandValid: boolean = true

  protected commandGroupMap: TSMap<GroupType, CommandData[]> = new TSMap()

  constructor (commandType: CommandType, textFromFileLoaded: string) {
    this.commandType = commandType
    this.textFromFileLoaded = textFromFileLoaded
    this.commandValid = true
    this.getCommandGroup()
    this.createContent()
    this.updateDownloadButtonStatus()
  }

  protected getCommandGroup (): void {
    const textLinesGroupMap: TSMap<GroupType, string> = this.getTextGroupMap(this.textFromFileLoaded)
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
    this.commandValid = true
    this.textFromFileLoaded = textFromFileLoaded
    this.getCommandGroup()
    this.createContent()
    this.updateDownloadButtonStatus()
  }

  protected getTextGroupMap (textFromFileLoaded: string): TSMap<GroupType, string> {
    const textLinesGroupMap: TSMap<GroupType, string> = new TSMap<GroupType, string>()
    const textLines: string[] = textFromFileLoaded.split('\n')
    let isGroupToMap = false
    let groupName: GroupType | null
    for (let i = 0; i < textLines.length; i++) {
      isGroupToMap = false
      groupName = this.getGroupName(textLines[i])

      //* 若找不到區塊分割的判斷字串，則略過換下一行
      if (groupName === null) {
        continue
      }
      const searchEndArr: string[] = this.mainConfig.groupSettingMap.get(groupName).searchEndPattern
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

  protected getCommandDataDetail (command: string, groupName: GroupType): ICommandDataDetail {
    const detail: ICommandDataDetail = {
      messageType: MessageType.NONE,
      commands: []
    }
    //* 檢查指令是否至少包含任何一個合規的語法
    if (this.mainConfig.validCommandMap.has(this.commandType)) {
      const groupvalidCommandMap: TSMap<GroupType, TSMap<string, RegExp>> = this.mainConfig.validCommandMap.get(this.commandType)
      if (groupvalidCommandMap.has(groupName)) {
        const validCommandMap: TSMap<string, RegExp> = groupvalidCommandMap.get(groupName)
        console.error('groupName : ', groupName)
        //* 取得該 GroupName 所有合法語法
        let hasValidCommand: boolean = false
        validCommandMap.forEach((regExp, commandType) => {
          console.error('regExp : ', regExp)
          //* 若抓到該 Group 允許的任一合法語法
          if (command.toUpperCase().search(regExp) > -1) {
            hasValidCommand = true
            console.error('hasValidCommand : ', hasValidCommand)
          }
        })
        if (!hasValidCommand) {
          detail.messageType = MessageType.NO_VALID_COMMAND_ERROR
          detail.commands.push('')
        }
      }
    }
    //* 檢查指令是否包含不合規的語法
    if (this.mainConfig.invalidCommandMap.has(this.commandType)) {
      const groupInvalidCommandMap: TSMap<GroupType, TSMap<string, RegExp>> = this.mainConfig.invalidCommandMap.get(this.commandType)
      if (groupInvalidCommandMap.has(groupName)) {
        const invalidCommandMap: TSMap<string, RegExp> = groupInvalidCommandMap.get(groupName)
        //* 取得該 GroupName 所有非法語法
        invalidCommandMap.forEach((regExp, commandType) => {
          //* 若抓到該 Group 禁止的任一非法語法
          if (command.toUpperCase().search(regExp) > -1) {
            detail.messageType = MessageType.INVALID_COMMAND_ERROR
            detail.commands.push(commandType!)
          }
        })
      }
    }
    //* 若是不存在不合規的語法，則檢查指令是否包含需略過的語法
    if (detail.commands.length === 0) {
      if (this.mainConfig.ignoredCommandMap.has(this.commandType)) {
        const groupIgnoredCommandMap: TSMap<GroupType, TSMap<string, RegExp>> = this.mainConfig.ignoredCommandMap.get(this.commandType)
        if (groupIgnoredCommandMap.has(groupName)) {
          const ignoredCommandMap: TSMap<string, RegExp> = groupIgnoredCommandMap.get(groupName)
          ignoredCommandMap.forEach((regExp, commandType) => {
            if (command.toUpperCase().search(regExp) > -1) {
              detail.messageType = MessageType.IGNORED_COMMAND
              detail.commands.push(commandType!)
            }
          })
        }
      } else {
        this.mainConfig.generalIgnoredCommands.forEach((regExp, commandType) => {
          if (command.toUpperCase().search(regExp) > -1) {
            detail.messageType = MessageType.IGNORED_COMMAND
            detail.commands.push(commandType!)
          }
        })
      }
    }
    return detail
  }

  /**
   * Split the raw text to five command groups (PreSQL , CountSQL , SelectSQL , MainSQL , PostSQL)
   * @param textLinesGroupMap
   * @returns TSMap<GroupType, CommandData[]>
   */
  protected getCommandGroupMap (textLinesGroupMap: TSMap<GroupType, string>): TSMap<GroupType, CommandData[]> {
    const commandGroupMap = new TSMap<GroupType, CommandData[]>()
    textLinesGroupMap.forEach((text, groupName) => {
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
          commandText = newTextLine + '\n'
        }
        //* 找到指令分割的判斷字串後，尋找指令的結束點
        let j: number
        for (j = i + 1; j < textLines.length; j++) {
          i = j - 1
          if (textLines[j].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
            if (this.mainConfig.enableTrimCommand) {
              commandText = this.cleanEmptyLineAtCommandEnd(commandText)
            }
            if (!this.mainConfig.enableTrimCommand || commandText.length > 0) {
              commandDataDetail = this.getCommandDataDetail(commandText, groupName!)
              commamds.push(new CommandData(commandText, commandDataDetail))
              commandGroupMap.set(groupName!, commamds)
            }
            isAddToMap = true
            break
          } else {
            textLines[j] = textLines[j].replace(this.mainConfig.singleCommandIndicator, '')
            if (!this.mainConfig.enableTrimCommand || textLines[j].trim().length > 0) {
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
          if (this.mainConfig.enableTrimCommand) {
            commandText = this.cleanEmptyLineAtCommandEnd(commandText)
            if (commandText.length > 0) {
              commandDataDetail = this.getCommandDataDetail(commandText, groupName!)
              commamds.push(new CommandData(commandText, commandDataDetail))
              commandGroupMap.set(groupName!, commamds)
            }
          } else {
            commandDataDetail = this.getCommandDataDetail(commandText, groupName!)
            commamds.push(new CommandData(commandText, commandDataDetail))
            commandGroupMap.set(groupName!, commamds)
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

  protected createPageContent (mainContainer: HTMLDivElement, commandGroupMap: TSMap<GroupType, CommandData[]>, elementConfig: ITabContentConfig): void {
    const contentContainer: HTMLDivElement = document.createElement('div') as HTMLDivElement
    contentContainer.id = elementConfig.mainContainer.contentContainer.id
    mainContainer.appendChild(contentContainer)

    this.mainConfig.groupSettingMap.keys().forEach(groupType => {
      let commands: CommandData[] = []
      if (commandGroupMap.has(groupType!)) {
        commands = commandGroupMap.get(groupType!)
      }
      this.createGroupContainer(groupType!, commands, contentContainer, elementConfig)
    })
  }

  protected createGroupContainer (groupType: GroupType, commands: CommandData[], parent: HTMLElement, elementConfig: ITabContentConfig): void {
    const config: IGroupContainerConfig = elementConfig.groupContainer

    const groupContainer: HTMLDivElement = document.createElement('div')
    groupContainer.id = config.id.replace('{groupType}', groupType)
    groupContainer.className = config.className
    parent.appendChild(groupContainer)

    const commandContainer = document.createElement('div')
    commandContainer.id = config.commandContainer.id.replace('{groupType}', groupType)
    commandContainer.className = config.commandContainer.className
    groupContainer.appendChild(commandContainer)

    const messageContainer: HTMLDivElement = document.createElement('div')
    messageContainer.id = config.messageContainer.id.replace('{groupType}', groupType)
    messageContainer.className = config.messageContainer.className
    groupContainer.appendChild(messageContainer)

    const title = document.createElement('p')
    title.id = config.commandContainer.title.id.replace('{groupType}', groupType)
    title.className = config.commandContainer.title.className
    title.innerText = this.mainConfig.groupSettingMap.get(groupType).title
    commandContainer.appendChild(title)

    let isCheckGroup: boolean = false
    if (this.mainConfig.checkCommandGroup.has(this.commandType)) {
      const checkGroupTypes: GroupType[] = this.mainConfig.checkCommandGroup.get(this.commandType)
      isCheckGroup = checkGroupTypes.includes(groupType)
    }

    if (commands.length === 0 && isCheckGroup) {
      this.commandValid = false
      let errorMessage: string = this.mainConfig.messageMap.get(MessageType.CONTENT_NOT_FOUND_ERROR)
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).title
      errorMessage = errorMessage.replace('{groupTitle}', groupTitle)
      errorMessage = errorMessage.replace('{groupTitle}', groupTitle)
      this.addClassName(title, 'command-error')
      const span: HTMLSpanElement = document.createElement('span')
      span.className = config.messageContainer.errorMessage.className
      span.innerText = errorMessage
      messageContainer.appendChild(span)
    }

    if (commands.length > 0) {
      const itemList = document.createElement('ul')
      itemList.className = 'command-list'
      commandContainer.appendChild(itemList)

      commands.forEach((command: CommandData, index: number) => {
        const listItem = document.createElement('li')
        listItem.className = 'command'
        if (command.detail.messageType !== MessageType.NONE) {
          this.appendMessage(command, groupType, index, config)
        }
        itemList.appendChild(listItem)

        const numOfItem = document.createElement('p')
        numOfItem.className = 'num-of-item'
        numOfItem.innerText = (index + 1).toString()
        listItem.appendChild(numOfItem)

        const paragraph = document.createElement('p')
        paragraph.id = config.commandContainer.paragraph.id.replace('{groupType}', groupType).replace('{index}', index.toString())
        paragraph.className = 'command-text pointerout-command'
        paragraph.innerText = command.content
        paragraph.addEventListener('pointerover', () => {
          this.addClassName(paragraph, 'pointerover-command')
          this.removeClassName(paragraph, 'pointerout-command')
        })
        paragraph.addEventListener('pointerout', () => {
          this.addClassName(paragraph, 'pointerout-command')
          this.removeClassName(paragraph, 'pointerover-command')
        })
        listItem.appendChild(paragraph)

        switch (command.detail.messageType) {
          case MessageType.IGNORED_COMMAND:
            this.addClassName(listItem, 'command-ignored')
            command.content = '-- ' + command.content
            break
          case MessageType.CONTENT_NOT_FOUND_ERROR:
          case MessageType.INVALID_COMMAND_ERROR:
          case MessageType.NO_VALID_COMMAND_ERROR:
            this.commandValid = false
            this.addClassName(listItem, 'command-error')
            break
        }
      })
    }
    if (messageContainer.children.length === 0) {
      this.addClassName(messageContainer, 'invisible')
    }
  }

  protected appendMessage (command: CommandData, groupType: GroupType, index: number, config: IGroupContainerConfig): void {
    if (command.detail !== undefined) {
      let container: HTMLDivElement
      const paragraph: HTMLSpanElement = document.createElement('p')
      command.detail.commands.forEach(e => {
        let message: string = this.mainConfig.messageMap.get(command.detail.messageType)
        const groupTitle = this.mainConfig.groupSettingMap.get(groupType).title
        message = message.replace('{groupTitle}', groupTitle)
        message = message.replace('{index}', (index + 1).toString())
        message = message.replace('{command}', e)
        paragraph.innerText = message
        switch (command.detail.messageType) {
          case MessageType.IGNORED_COMMAND:
            paragraph.className = config.messageContainer.warningMessage.className
            container = document.getElementById(config.messageContainer.id.replace('{groupType}', groupType)) as HTMLDivElement
            break
          case MessageType.INVALID_COMMAND_ERROR:
          case MessageType.NO_VALID_COMMAND_ERROR:
          case MessageType.CONTENT_NOT_FOUND_ERROR:
            paragraph.className = config.messageContainer.errorMessage.className
            container = document.getElementById(config.messageContainer.id.replace('{groupType}', groupType)) as HTMLDivElement
            break
        }
        container.appendChild(paragraph)
      })
    }
  }

  public updateDownloadButtonStatus (): void {
    const downloadButton = document.getElementById('download-button')
    if (downloadButton != null) {
      if (this.commandValid && this.textFromFileLoaded !== undefined) {
        this.removeClassName(downloadButton, 'inactive')
        this.addClassName(downloadButton, 'active')
      } else {
        this.removeClassName(downloadButton, 'active')
        this.addClassName(downloadButton, 'inactive')
      }
    }
  }

  public downloadXML (): void {
    if (!this.commandValid) {
      return
    }
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\r\n'
    xmlContent += '<SQLBodys>\r\n'
    Object.values(GroupType).forEach(groupType => {
      xmlContent += '  <' + groupType + '>\r\n'
      if (this.commandGroupMap.has(groupType)) {
        this.commandGroupMap.get(groupType).forEach((command, index) => {
          let sqlCommandStr = '    <SQL sql_idx="' + (index + 1) + '">'
          //* 需透過編碼轉換 "<"、">"、"=" 等特殊字元
          sqlCommandStr += He.encode(command.content) + '</SQL>'
          xmlContent += sqlCommandStr + '\r\n'
        })
      }
      xmlContent += '  </' + groupType + '>\r\n'
    })
    xmlContent += '</SQLBodys>'

    const blob = new Blob([xmlContent], { type: 'text/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'data.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  protected addClassName (element: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(className => { element.className += ' ' + className })
  }

  protected removeClassName (element: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(className => { element.className = element.className.replace(className, '').replace('  ', ' ').trim() })
  }
}
