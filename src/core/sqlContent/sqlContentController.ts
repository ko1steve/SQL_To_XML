import { CommandType, GroupType, IGroupSetting, MainConfig } from 'src/mainConfig'
import { IGroupContainerConfig, ISqlContentConfig } from './sqlContentConfig'
import { CommandData, MessageType, ICommandDataMessage, StringBuilder, IGroupCommandDetail, ICommandDataDetail, IIndicateCommandErrorData } from 'src/config/commandData'
import { TSMap } from 'typescript-map'
import localforage from 'localforage'
import { Container } from 'typescript-ioc'
import { DataModel } from 'src/model/dataModel'
import { RegExpConfig, Command } from 'src/config/regExpConfig'

export class SqlContentController {
  protected dataModel: DataModel
  protected mainConfig: MainConfig = new MainConfig()
  protected commandType: CommandType = CommandType.NONE
  protected textFromFileLoaded: string
  protected indicateCommandErrorMap: TSMap<GroupType, IIndicateCommandErrorData> = new TSMap()

  constructor (commandType: CommandType, textFromFileLoaded: string, fileName: string) {
    this.dataModel = Container.get(DataModel)
    this.dataModel.fileName = fileName
    this.commandType = commandType
    this.textFromFileLoaded = textFromFileLoaded
    this.dataModel.setCommandValid(commandType, true)
    this.initLocalForge()
    this.initialize()
  }

  protected initLocalForge (): void {
    this.resetLocalForge().then(() => {
      localforage.config({
        driver: localforage.INDEXEDDB,
        name: 'SqlConverter',
        storeName: 'SqlConverter'
      })
    })
  }

  protected initialize (): void {
    this.transTextToCommand().then(() => {
      this.createPageContent().then(() => {
        const overlay = document.getElementById('overlay') as HTMLDivElement
        overlay.style.display = 'none'
      })
    })
  }

  public updateNewPageContent (textFromFileLoaded: string, fileName: string): void {
    this.resetLocalForge().then(() => {
      const mainContainer: HTMLDivElement = document.getElementById('main-container-' + this.commandType) as HTMLDivElement
      const contentContainer: HTMLDivElement = document.getElementById('content-container-' + this.commandType) as HTMLDivElement
      mainContainer.removeChild(contentContainer)
      this.dataModel.setCommandValid(this.commandType, true)
      this.dataModel.fileName = fileName
      this.textFromFileLoaded = textFromFileLoaded
      this.initialize()
    })
  }

  protected resetLocalForge (): Promise<void> {
    return new Promise<void>(resolve => {
      localforage.clear().then(() => {
        resolve()
      })
    })
  }

  protected transTextToCommand (): Promise<void> {
    return new Promise(resolve => {
      const promiseList: Promise<void>[] = []
      const textLines: string[] = this.textFromFileLoaded.split('\r\n')
      this.textFromFileLoaded = ''
      let groupName: GroupType | null
      for (let i = 0; i < textLines.length; i++) {
        groupName = this.getGroupName(textLines[i])

        //* 若找不到區塊分割的判斷字串，則略過換下一行
        if (groupName === null) {
          continue
        }
        const startIndex = i

        //* 區塊分割字串下一行是否必須是指令標註字串
        if (this.mainConfig.firstCommandIsNextToGroupName) {
          if (i + 1 >= textLines.length || !textLines[i + 1].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
            this.indicateCommandErrorMap.set(groupName, { commandIndex: i + 1 })
            continue
          }
        } else {
          //* 支援「區塊分割字串」與「指令標註字串」之間有空白字串或註解
          let j
          for (j = i + 1; j < textLines.length; j++) {
            if (textLines[j].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
              i = j - 1
              break
            } else if (textLines[j].trim() === '' || textLines[j].trim().search(/^--|^\/\*/) < 0) {
              continue
            } else {
              this.indicateCommandErrorMap.set(groupName, { commandIndex: j })
              break
            }
          }
          if (j === textLines.length) {
            this.indicateCommandErrorMap.set(groupName, { commandIndex: j - 1 })
          }
          if (this.indicateCommandErrorMap.has(groupName)) {
            continue
          }
        }
        const searchEndArr: string[] = this.mainConfig.groupSettingMap.get(groupName).searchEndPattern
        const textSB = new StringBuilder()

        //* 找到區塊分割的判斷字串後，尋找區塊的結束點
        let j: number
        for (j = i + 1; j < textLines.length; j++) {
          i = j - 1
          //* 若找到下一個區塊，開始將文字拆分為指令
          if (searchEndArr.some(pattern => textLines[j].trim().startsWith(pattern))) {
            const promise = this.setCommandGroup(textSB.strings, groupName, {
              startIndex,
              lines: j - startIndex
            })
            promiseList.push(promise)
            break
          }
          //* 找到結束點之前，不斷累加該行的指令文字
          textSB.append(textLines[j])
        }
        //* 若 textlines 已全部判斷過，開始將文字拆分為語法
        if (j === textLines.length) {
          const promise = this.setCommandGroup(textSB.strings, groupName, {
            startIndex,
            lines: j - 1 - startIndex
          })
          promiseList.push(promise)
          break
        }
      }
      //* 等待所有區塊的純文字拆分成語法
      Promise.all(promiseList).then(() => {
        resolve()
      })
    })
  }

  protected getCommandDataDetail (commadTextSB: StringBuilder, groupName: GroupType, detail: ICommandDataDetail): ICommandDataMessage[] {
    const messages: ICommandDataMessage[] = []

    const upperText = commadTextSB.strings.filter(e => !e.trim().startsWith('--')).join('\r\n').toUpperCase().trim()
    if (upperText === '') {
      messages.push({
        messageType: MessageType.EMPTY_OR_COMMENT_ONLY_ERROR,
        command: '',
        globalTextLineIndex: detail.groupTextLineIndex,
        commandIndex: detail.commandIndex
      })
      return messages
    }

    let matchError: boolean = false

    //* 反向表列的部分 (不包含 PreProdSQL)，檢查指令是否超過一個語法
    if ([GroupType.PreSQL, GroupType.PostSQL].includes(groupName)) {
      if (this.mainConfig.useAllRegExpCheckMultiCommand) {
        const matches: RegExpMatchArray | null = upperText.match(RegExpConfig.ALL_VALID_REGEXP)
        if (matches && matches.length > 1) {
          messages.push({
            messageType: MessageType.EXCEENDS_COMMAND_LIMIT_ERROR,
            command: '',
            globalTextLineIndex: detail.groupTextLineIndex,
            commandIndex: detail.commandIndex
          })
          matchError = true
        }
        if (matchError) {
          return messages
        }
      } else {
        const regExpArr: RegExp[] = [
          RegExpConfig.ALL_DDL_VALID_REGEXP_WITHOUT_CHECK_TEMP_TABLE,
          RegExpConfig.ALL_DML_VALID_REGEXP_WITHOUT_CHECK_TEMP_TABLE
        ]
        for (const regExp of regExpArr) {
          const matches: RegExpMatchArray | null = upperText.match(regExp)
          if (matches && matches.length > 1) {
            messages.push({
              messageType: MessageType.EXCEENDS_COMMAND_LIMIT_ERROR,
              command: '',
              globalTextLineIndex: detail.groupTextLineIndex,
              commandIndex: detail.commandIndex
            })
            matchError = true
          }
          if (matchError) {
            return messages
          }
        }
      }
    }

    //* 檢查 GRANT、REVOKE 等語法是否出現在 DDL 複雜語法之外
    const cleanedTextlines = commadTextSB.strings.map(line => line.trim())
    for (let i: number = cleanedTextlines.length - 1; i >= 0; i--) {
      //* 若抓到 DDL 複查語法的結束符號，跳過檢查
      if (this.mainConfig.ddlComplexCommandEnds.includes(cleanedTextlines[i])) {
        break
      } else if (cleanedTextlines[i].search(this.mainConfig.grantRevokeCommand.regExp) > -1) {
        messages.push({
          messageType: MessageType.INVALID_COMMAND_ERROR,
          command: this.mainConfig.grantRevokeCommand.command,
          globalTextLineIndex: detail.groupTextLineIndex,
          commandIndex: detail.commandIndex
        })
        matchError = true
      }
    }
    if (matchError) {
      return messages
    }

    //* 檢查指令是否包含不合規的語法
    if (this.mainConfig.invalidCommandMap.has(this.commandType)) {
      const groupInvalidCommandMap: TSMap<GroupType, TSMap<string, RegExp>> = this.mainConfig.invalidCommandMap.get(this.commandType)
      if (groupInvalidCommandMap.has(groupName)) {
        const invalidCommandMap: TSMap<string, RegExp> = groupInvalidCommandMap.get(groupName)
        //* 取得該 GroupName 所有非法語法
        let count = 0
        invalidCommandMap.forEach((regExp, commandName) => {
          //* 若抓到該 Group 禁止的任一非法語法
          const matches: RegExpMatchArray | null = upperText.match(regExp)
          if (matches) {
            if (matches.length > 0) {
              count += matches.length
              if (commandName !== Command.SELECT) {
                messages.push({
                  messageType: MessageType.INVALID_COMMAND_ERROR,
                  command: commandName!,
                  globalTextLineIndex: detail.groupTextLineIndex,
                  commandIndex: detail.commandIndex
                })
                matchError = true
              } else {
                //* 判斷是否為 Insert Into 語法
                if (upperText.search(RegExpConfig.INSERT_INTO_REGEXP) < 0) {
                  messages.push({
                    messageType: MessageType.INVALID_COMMAND_ERROR,
                    command: commandName!,
                    globalTextLineIndex: detail.groupTextLineIndex,
                    commandIndex: detail.commandIndex
                  })
                  matchError = true
                }
              }
            }
          }
        })
        //* 判斷多筆語法錯誤 (若這邊不擋，同時出現 Insert-Into-Select 和 Select 語法時會有問題)
        if (!this.mainConfig.useAllRegExpCheckMultiCommand) {
          if (count > 1) {
            messages.push({
              messageType: MessageType.EXCEENDS_COMMAND_LIMIT_ERROR,
              command: '',
              globalTextLineIndex: detail.groupTextLineIndex,
              commandIndex: detail.commandIndex
            })
            matchError = true
          }
        } else {
          const matches: RegExpMatchArray | null = upperText.match(RegExpConfig.ALL_VALID_REGEXP)
          if (matches && matches.length > 1) {
            messages.push({
              messageType: MessageType.EXCEENDS_COMMAND_LIMIT_ERROR,
              command: '',
              globalTextLineIndex: detail.groupTextLineIndex,
              commandIndex: detail.commandIndex
            })
            matchError = true
          }
        }
      }
    }
    if (matchError) {
      return messages
    }

    //* 檢查指令是否至少包含任何一個合規的語法
    if (this.mainConfig.validCommandMap.has(this.commandType)) {
      const validCommandMap: TSMap<string, RegExp> = this.mainConfig.validCommandMap.get(this.commandType)?.get(groupName)
      if (validCommandMap) {
        let isMatch: boolean = false
        let count: number = 0
        validCommandMap.forEach((regExp, commandName) => {
          const matches: RegExpMatchArray | null = upperText.match(regExp)
          if (matches) {
            if (matches.length > 0) {
              if (commandName !== Command.SELECT) {
                count += matches.length
                isMatch = true
              } else {
                //* 判斷是否為 Insert Into 語法
                if (upperText.search(RegExpConfig.INSERT_INTO_REGEXP) < 0) {
                  count += matches.length
                  isMatch = true
                }
              }
            }
          }
        })
        //* 判斷多筆語法錯誤
        if (!this.mainConfig.useAllRegExpCheckMultiCommand && count > 1) {
          messages.push({
            messageType: MessageType.EXCEENDS_COMMAND_LIMIT_ERROR,
            command: '',
            globalTextLineIndex: detail.groupTextLineIndex,
            commandIndex: detail.commandIndex
          })
        }
        //* 沒有匹配到任何語法，則視為錯誤
        if (!isMatch) {
          messages.push({
            messageType: MessageType.NO_VALID_COMMAND_ERROR,
            command: '',
            globalTextLineIndex: detail.groupTextLineIndex,
            commandIndex: detail.commandIndex
          })
        }
      }
    }
    return messages
  }

  protected setCommandGroup (textLines: string[], groupName: GroupType, detail: IGroupCommandDetail): Promise<void> {
    return new Promise(resolve => {
      if (textLines.length === 0) {
        return resolve()
      }
      const commands: CommandData[] = []

      let commadTextSB: StringBuilder | null = null

      for (let i = 0; i < textLines.length; i++) {
        if (!textLines[i].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
          continue
        }
        const startIndex = i
        commadTextSB = new StringBuilder()
        const commandDataMessages: ICommandDataMessage[] = []

        const newTextLine = textLines[i].replace(this.mainConfig.singleCommandIndicator, '').trim()
        if (newTextLine.length !== 0) {
          commadTextSB.append(newTextLine)
        }

        let j: number
        for (j = i + 1; j < textLines.length; j++) {
          if (textLines[j].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
            commandDataMessages.push(...this.getCommandDataDetail(commadTextSB, groupName!, {
              groupTextLineIndex: detail.startIndex + 1 + startIndex,
              commandIndex: commands.length
            }))
            commands.push(new CommandData(commadTextSB, commandDataMessages))
            i = j - 1
            break
          } else {
            textLines[j] = textLines[j].replace(this.mainConfig.singleCommandIndicator, '')
            commadTextSB.append(textLines[j])
          }
        }

        if (j === textLines.length) {
          commandDataMessages.push(...this.getCommandDataDetail(commadTextSB, groupName!, {
            groupTextLineIndex: detail.startIndex + 1 + startIndex,
            commandIndex: commands.length
          }))
          commands.push(new CommandData(commadTextSB, commandDataMessages))
          break
        }
      }
      if (commands.length > 0) {
        localforage.setItem(groupName + '-command', commands).then(() => {
          resolve()
        })
      } else {
        resolve()
      }
    })
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

  protected createPageContent (): Promise<void> {
    return new Promise<void>(resolve => {
      const mainContainer: HTMLDivElement = document.getElementById('main-container-' + this.commandType) as HTMLDivElement
      const elementConfig: ISqlContentConfig = this.mainConfig.tabContentConfigMap.get(this.commandType) as ISqlContentConfig
      const contentContainer: HTMLDivElement = document.createElement('div') as HTMLDivElement
      contentContainer.id = elementConfig.mainContainer.contentContainer.id
      mainContainer.appendChild(contentContainer)

      const promistList: Promise<void>[] = []
      this.mainConfig.groupSettingMap.keys().forEach(groupName => {
        const promise = new Promise<void>(resolve => {
          localforage.getItem(groupName + '-command').then((commands) => {
            if (!commands) {
              commands = []
            }
            this.createGroupContainer(groupName!, commands as CommandData[], contentContainer, elementConfig)
            resolve()
          })
        })
        promistList.push(promise)
      })
      Promise.all(promistList).then(() => {
        resolve()
      })
    })
  }

  protected createGroupContainer (groupType: GroupType, commands: CommandData[], parent: HTMLElement, elementConfig: ISqlContentConfig): void {
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
      this.dataModel.setCommandValid(this.commandType, false)
      let errorMessage: string = this.mainConfig.messageMap.get(MessageType.CONTENT_NOT_FOUND_ERROR)
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).title
      errorMessage = errorMessage.replace('{groupTitle}', groupTitle)
      this.addClassName(title, 'command-error')
      const span: HTMLSpanElement = document.createElement('span')
      span.className = config.messageContainer.errorMessage.className
      span.innerText = errorMessage
      messageContainer.appendChild(span)
    }

    if (this.indicateCommandErrorMap.has(groupType)) {
      const commandIndex: number = this.indicateCommandErrorMap.get(groupType).commandIndex
      this.dataModel.setCommandValid(this.commandType, false)
      let errorMessage: string = this.mainConfig.messageMap.get(MessageType.COMMAND_INDICATOR_NOT_FOUND)
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).title
      errorMessage = errorMessage.replaceAll('{groupTitle}', groupTitle)
      errorMessage = errorMessage.replaceAll('{textLineIndex}', (commandIndex + 1).toString())
      this.addClassName(title, 'command-error')
      const span: HTMLSpanElement = document.createElement('span')
      span.className = config.messageContainer.errorMessage.className
      span.innerText = errorMessage
      messageContainer.appendChild(span)
    }

    if (commands.length > 0) {
      if (groupType === GroupType.MainSQL) {
        const totalCommandsText = document.createElement('p')
        totalCommandsText.innerText = '語法數量 : ' + commands.length.toString()
        commandContainer.appendChild(totalCommandsText)
      }
      if (commands.length >= this.mainConfig.maxGroupCommandAmount) {
        const warning = document.createElement('p')
        warning.innerText = '語法數量超過 ' + this.mainConfig.maxGroupCommandAmount.toString() + ' 筆, 以下區塊只顯示錯誤語法'
        commandContainer.appendChild(warning)
      }
      const itemList = document.createElement('ul')
      itemList.className = 'command-list'
      commandContainer.appendChild(itemList)

      commands.forEach((command: CommandData, index: number) => {
        let showCommand = true
        if (command.messages.length > 0) {
          this.appendMessage(command, groupType, index, config)
        } else if (commands.length >= this.mainConfig.maxGroupCommandAmount) {
          showCommand = false
        }
        if (showCommand) {
          const listItem = document.createElement('li')
          listItem.className = 'command'
          itemList.appendChild(listItem)

          const numOfItem = document.createElement('p')
          numOfItem.className = 'num-of-item'
          numOfItem.innerText = (index + 1).toString()
          listItem.appendChild(numOfItem)

          const paragraph = document.createElement('p')
          paragraph.id = config.commandContainer.paragraph.id.replace('{groupType}', groupType).replace('{index}', index.toString())
          paragraph.className = 'command-text pointerout-command'
          //* 由於存進 localforge 的物件，function 會全被拿掉，member 的存取修飾詞會全部變 public，只能這樣做處理
          paragraph.innerText = (command.content as any)._strings.join('\r\n')
          paragraph.addEventListener('pointerover', () => {
            this.addClassName(paragraph, 'pointerover-command')
            this.removeClassName(paragraph, 'pointerout-command')
          })
          paragraph.addEventListener('pointerout', () => {
            this.addClassName(paragraph, 'pointerout-command')
            this.removeClassName(paragraph, 'pointerover-command')
          })
          listItem.appendChild(paragraph)

          if (command.messages.length > 0) {
            this.dataModel.setCommandValid(this.commandType, false)
            this.addClassName(listItem, 'command-error')
          }
        }
      })
    }
    if (messageContainer.children.length === 0) {
      this.addClassName(messageContainer, 'invisible')
    }
  }

  protected appendMessage (command: CommandData, groupType: GroupType, index: number, config: IGroupContainerConfig): void {
    if (command.messages.length > 0) {
      let container: HTMLDivElement
      const paragraph: HTMLSpanElement = document.createElement('p')
      command.messages.forEach(detail => {
        let message: string = this.mainConfig.messageMap.get(detail.messageType)
        const groupTitle = this.mainConfig.groupSettingMap.get(groupType).title
        message = message.replaceAll('{groupTitle}', groupTitle)
        message = message.replaceAll('{sql_index}', (detail.commandIndex + 1).toString())
        message = message.replaceAll('{textLineIndex}', (detail.globalTextLineIndex + 1).toString())
        message = message.replaceAll('{command}', detail.command)
        switch (detail.messageType) {
          case MessageType.INVALID_COMMAND_ERROR:
            if (detail.command === Command.ANY_COMMAND) {
              message = this.mainConfig.messageMap.get(detail.messageType).replaceAll(' "{command}" ', '任何')
            }
            paragraph.className = config.messageContainer.errorMessage.className
            container = document.getElementById(config.messageContainer.id.replaceAll('{groupType}', groupType)) as HTMLDivElement
            break
          default:
            paragraph.className = config.messageContainer.errorMessage.className
            container = document.getElementById(config.messageContainer.id.replaceAll('{groupType}', groupType)) as HTMLDivElement
            break
        }
        paragraph.innerText = message
        container.appendChild(paragraph)
      })
    }
  }

  protected addClassName (element: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(className => { element.className += ' ' + className })
  }

  protected removeClassName (element: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(className => { element.className = element.className.replace(className, '').replace('  ', ' ').trim() })
  }
}
