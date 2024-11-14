import localforage from 'localforage'
import { Container } from 'typescript-ioc'
import { TSMap } from 'typescript-map'
import { ICommandData, ICommandDataDetail, ICommandDataMessage, IGroupCommandDetail, IIndicateCommandErrorData, MessageType } from '../../data/commandData'
import { StringBuilder } from '../../data/stringBuilder'
import { CommandType, GroupType, IGroupSetting, MainConfig } from '../../mainConfig'
import { Command, RegExpConfig } from '../../config/regExpConfig'

export class SqlHandler {
  protected mainConfig: MainConfig
  protected commandType: CommandType
  protected _indicateCommandErrorMap: TSMap<GroupType, IIndicateCommandErrorData>

  public get indicateCommandErrorMap () {
    return this._indicateCommandErrorMap
  }

  constructor (commandType: CommandType) {
    this.commandType = commandType
    this.mainConfig = Container.get(MainConfig)
    this._indicateCommandErrorMap = new TSMap()
    this.initLocalForge()
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

  protected resetLocalForge (): Promise<void> {
    return new Promise<void>(resolve => {
      localforage.clear().then(() => {
        resolve()
      })
    })
  }

  public transTextToCommand (textFromFileLoaded: string): Promise<void> {
    return new Promise<void>(resolve => {
      const promiseList: Promise<void>[] = []
      const textLines: string[] = textFromFileLoaded.split('\r\n')
      let groupName: GroupType | null
      for (let i = 0; i < textLines.length; i++) {
        groupName = this.getGroupName(textLines[i])

        //* 若找不到區塊分割的判斷字串，則略過換下一行
        if (groupName === null) {
          continue
        }
        const startIndex = i
        const searchEndArr: string[] = this.mainConfig.groupSettingMap.get(groupName).searchEndPattern

        //* 區塊分割字串下一行是否必須是指令標註字串
        if (this.mainConfig.firstCommandIsNextToGroupName) {
          if (i + 1 >= textLines.length) {
            this.indicateCommandErrorMap.set(groupName, { commandIndex: i + 1, isBlank: true })
          } else {
            const isFindCommandTag: boolean = textLines[i + 1].trim().startsWith(this.mainConfig.singleCommandIndicator)
            const isFindGroupTag: boolean = searchEndArr.some(pattern => textLines[i + 1].trim().startsWith(pattern))
            if (!isFindCommandTag && !isFindGroupTag) {
              const isBlank: boolean = textLines[i + 1].trim() === ''
              this.indicateCommandErrorMap.set(groupName, { commandIndex: i + 1, isBlank })
            }
          }
        } else {
          //* 支援「區塊分割字串」與「指令標註字串」之間有空白字串或註解
          let j: number
          let isError: boolean = false
          for (j = i + 1; j < textLines.length; j++) {
            const isFindCommandTag: boolean = textLines[j].trim().startsWith(this.mainConfig.singleCommandIndicator)
            const isFindGroupTag: boolean = searchEndArr.some(pattern => textLines[j].trim().startsWith(pattern))
            if (isFindCommandTag || isFindGroupTag) {
              i = j - 1
              break
            } else if (textLines[j].trim() === '' || textLines[j].trim().search(/^--|^\/\*/) < 0) {
              continue
            } else {
              this.indicateCommandErrorMap.set(groupName, { commandIndex: j, isBlank: false })
              isError = true
            }
          }
          if (j === textLines.length && !isError) {
            this.indicateCommandErrorMap.set(groupName, { commandIndex: j - 1, isBlank: true })
            isError = true
          }
        }
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

  protected setCommandGroup (textLines: string[], groupName: GroupType, detail: IGroupCommandDetail): Promise<void> {
    const commands: ICommandData[] = []

    let commadTextSB: StringBuilder | null = null

    for (let i = 0; i < textLines.length; i++) {
      if (!textLines[i].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
        continue
      }
      let startIndex = i
      commadTextSB = new StringBuilder()
      const commandDataMessages: ICommandDataMessage[] = []

      const newTextLine = textLines[i].replace(this.mainConfig.singleCommandIndicator, '').trim()
      if (newTextLine.length !== 0) {
        commadTextSB.append(newTextLine)
      } else {
        startIndex++
      }

      let j: number
      for (j = i + 1; j < textLines.length; j++) {
        if (textLines[j].trim().startsWith(this.mainConfig.singleCommandIndicator)) {
          commandDataMessages.push(...this.getCommandDataDetail(commadTextSB, groupName!, {
            globalTextLineIndex: detail.startIndex + startIndex,
            commandIndex: commands.length
          }))
          commands.push({
            content: commadTextSB,
            messages: commandDataMessages,
            startIndex: detail.startIndex + startIndex,
            endIndex: detail.startIndex + 1 + j - 1
          })
          i = j - 1
          break
        } else {
          textLines[j] = textLines[j].replace(this.mainConfig.singleCommandIndicator, '')
          commadTextSB.append(textLines[j])
        }
      }

      if (j === textLines.length) {
        commandDataMessages.push(...this.getCommandDataDetail(commadTextSB, groupName!, {
          globalTextLineIndex: detail.startIndex + startIndex,
          commandIndex: commands.length
        }))
        commands.push({
          content: commadTextSB,
          messages: commandDataMessages,
          startIndex: detail.startIndex + startIndex,
          endIndex: detail.startIndex + 1 + j - 1
        })
        break
      }
    }
    return new Promise<void>((resolve) => {
      this.setItem(groupName + '-command', commands).then(() => {
        if (commands.length === 0 && this.indicateCommandErrorMap.has(groupName)) {
          const errorData: IIndicateCommandErrorData = this.indicateCommandErrorMap.get(groupName)
          if (errorData.isBlank) {
            this.indicateCommandErrorMap.delete(groupName)
          }
        }
        resolve()
      })
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

  protected getCommandDataDetail (commadTextSB: StringBuilder, groupName: GroupType, detail: ICommandDataDetail): ICommandDataMessage[] {
    const messages: ICommandDataMessage[] = []

    const upperText = commadTextSB.strings.filter(e => !e.trim().startsWith('--')).join('\r\n').toUpperCase().trim()
    if (upperText === '') {
      messages.push({
        messageType: MessageType.EMPTY_OR_COMMENT_ONLY_ERROR,
        command: '',
        globalTextLineIndex: detail.globalTextLineIndex,
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
            globalTextLineIndex: detail.globalTextLineIndex,
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
              globalTextLineIndex: detail.globalTextLineIndex,
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
      //* 若抓到 DDL 複雜語法的結束符號，跳過檢查
      if (this.mainConfig.ddlComplexCommandEnds.includes(cleanedTextlines[i])) {
        break
      } else if (cleanedTextlines[i].search(this.mainConfig.grantRevokeCommand.regExp) > -1) {
        messages.push({
          messageType: MessageType.INVALID_COMMAND_ERROR,
          command: this.mainConfig.grantRevokeCommand.command,
          globalTextLineIndex: detail.globalTextLineIndex,
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
                  globalTextLineIndex: detail.globalTextLineIndex,
                  commandIndex: detail.commandIndex
                })
                matchError = true
              } else {
                //* 判斷是否為 Insert Into 語法
                if (upperText.search(RegExpConfig.INSERT_INTO_WITH_SELECT_REGEXP) < 0) {
                  messages.push({
                    messageType: MessageType.INVALID_COMMAND_ERROR,
                    command: commandName!,
                    globalTextLineIndex: detail.globalTextLineIndex,
                    commandIndex: detail.commandIndex
                  })
                  matchError = true
                } else {
                  count--
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
              globalTextLineIndex: detail.globalTextLineIndex,
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
              globalTextLineIndex: detail.globalTextLineIndex,
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
              count += matches.length
              if (commandName !== Command.SELECT) {
                isMatch = true
              } else {
                //* 判斷是否為 Insert Into 語法
                if (upperText.search(RegExpConfig.INSERT_INTO_WITH_SELECT_REGEXP) < 0) {
                  isMatch = true
                } else {
                  count--
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
            globalTextLineIndex: detail.globalTextLineIndex,
            commandIndex: detail.commandIndex
          })
        }
        //* 沒有匹配到任何語法，則視為錯誤
        if (!isMatch) {
          messages.push({
            messageType: MessageType.NO_VALID_COMMAND_ERROR,
            command: '',
            globalTextLineIndex: detail.globalTextLineIndex,
            commandIndex: detail.commandIndex
          })
        }
      }
    }
    return messages
  }

  protected setItem (key: string, value: unknown): Promise<void> {
    return new Promise<void>(resolve => {
      localforage.setItem(key, value).then(() => {
        resolve()
      })
    })
  }

  public getItem<T> (key: string): Promise<T | null> {
    return new Promise<T | null>(resolve => {
      localforage.getItem<T>(key).then((items) => {
        resolve(items)
      })
    })
  }

  public reset (): void {
    this.indicateCommandErrorMap.clear()
    this.initLocalForge()
  }
}
