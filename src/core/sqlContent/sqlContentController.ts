import { CommandType, GroupType, IGroupSetting, MainConfig } from 'src/mainConfig'
import { IGroupContainerConfig, ISqlContentConfig } from './sqlContentConfig'
import { CommandData, MessageType, ICommandDataMessage, IGroupCommandDetail, ICommandDataDetail, IIndicateCommandErrorData } from 'src/data/commandData'
import { StringBuilder } from 'src/data/stringBuilder'
import { TSMap } from 'typescript-map'
import localforage from 'localforage'
import { Container } from 'typescript-ioc'
import { DataModel } from 'src/model/dataModel'
import { RegExpConfig, Command } from 'src/config/regExpConfig'
import { SqlHandler } from 'src/core/sqlHandler/sqlHandler'

export class SqlContentController {
  protected dataModel: DataModel
  protected mainConfig: MainConfig
  protected sqlHandler: SqlHandler
  protected commandType: CommandType
  protected textFromFileLoaded: string

  constructor (commandType: CommandType, textFromFileLoaded: string, fileName: string) {
    this.dataModel = Container.get(DataModel)
    this.mainConfig = Container.get(MainConfig)
    this.sqlHandler = new SqlHandler(commandType)
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
    this.sqlHandler.transTextToCommand(this.textFromFileLoaded).then(() => {
      this.textFromFileLoaded = ''
      this.createPageContent().then(() => {
        const overlay = document.getElementById('overlay') as HTMLDivElement
        overlay.style.display = 'none'
      })
    })
  }

  public updateNewPageContent (textFromFileLoaded: string, fileName: string): void {
    this.resetLocalForge().then(() => {
      const mainContainer: HTMLDivElement = document.getElementById('main-container-' + this.commandType.toLowerCase()) as HTMLDivElement
      const contentContainer: HTMLDivElement = document.getElementById('content-container-' + this.commandType.toLowerCase()) as HTMLDivElement
      mainContainer.removeChild(contentContainer)
      this.dataModel.setCommandValid(this.commandType, true)
      this.dataModel.fileName = fileName
      this.textFromFileLoaded = textFromFileLoaded
      this.sqlHandler.reset()
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

  protected createPageContent (): Promise<void> {
    return new Promise<void>(resolve => {
      const mainContainer: HTMLDivElement = document.getElementById('main-container-' + this.commandType.toLowerCase()) as HTMLDivElement
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
            this.createGroupContainer(groupName!, commands as CommandData[], contentContainer, elementConfig).then(() => {
              resolve()
            })
          })
        })
        promistList.push(promise)
      })
      Promise.all(promistList).then(() => {
        resolve()
      })
    })
  }

  protected async createGroupContainer (groupType: GroupType, commands: CommandData[], parent: HTMLElement, elementConfig: ISqlContentConfig): Promise<void> {
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

    //* 顯示「沒有 SQL 命令標註字串錯誤」
    if (this.sqlHandler.indicateCommandErrorMap.has(groupType)) {
      const commandIndex: number = this.sqlHandler.indicateCommandErrorMap.get(groupType).commandIndex
      this.dataModel.setCommandValid(this.commandType, false)
      let errorMessage: string = this.mainConfig.messageMap.get(MessageType.COMMAND_INDICATOR_NOT_FOUND_ERROR)
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
      errorMessage = errorMessage.replaceAll('{titleInMsg}', groupTitle)
      errorMessage = errorMessage.replaceAll('{textLineIndex}', (commandIndex + 1).toString())
      this.addClassName(title, 'command-error')
      const span: HTMLSpanElement = document.createElement('span')
      span.className = config.messageContainer.errorMessage.className
      span.innerText = errorMessage
      messageContainer.appendChild(span)
      //* 顯示「沒有任何 SQL 命令錯誤」
    } else if (commands.length === 0 && isCheckGroup) {
      this.dataModel.setCommandValid(this.commandType, false)
      let errorMessage: string = this.mainConfig.messageMap.get(MessageType.CONTENT_NOT_FOUND_ERROR)
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
      errorMessage = errorMessage.replaceAll('{titleInMsg}', groupTitle)
      this.addClassName(title, 'command-error')
      const span: HTMLSpanElement = document.createElement('span')
      span.className = config.messageContainer.errorMessage.className
      span.innerText = errorMessage
      messageContainer.appendChild(span)
    }

    if (commands.length > 0 && !this.sqlHandler.indicateCommandErrorMap.has(groupType)) {
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
          this.appendMessage(command, groupType, config)
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

    await localforage.getItem(groupType + '-command').then((items) => {
      if (!items) {
        this.dataModel.setCommandValid(this.commandType, false)
        let errorMessage: string = this.mainConfig.messageMap.get(MessageType.NO_GROUP_TAG)
        const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
        errorMessage = errorMessage.replaceAll('{titleInMsg}', groupTitle)
        this.addClassName(title, 'command-error')
        const span: HTMLSpanElement = document.createElement('span')
        span.className = config.messageContainer.errorMessage.className
        span.innerText = errorMessage
        messageContainer.appendChild(span)
      }
    })
  }

  protected appendMessage (command: CommandData, groupType: GroupType, config: IGroupContainerConfig): void {
    if (command.messages.length > 0) {
      let container: HTMLDivElement
      const paragraph: HTMLSpanElement = document.createElement('p')
      command.messages.forEach(detail => {
        let message: string = this.mainConfig.messageMap.get(detail.messageType)
        const titleInMsg = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
        message = message.replaceAll('{titleInMsg}', titleInMsg)
        message = message.replaceAll('{sql_index}', (detail.commandIndex + 1).toString())
        message = message.replaceAll('{textLineIndex}', (detail.globalTextLineIndex + 1).toString())
        message = message.replaceAll('{command}', detail.command)
        paragraph.className = config.messageContainer.errorMessage.className
        paragraph.innerText = message
        container = document.getElementById(config.messageContainer.id.replaceAll('{groupType}', groupType)) as HTMLDivElement
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
