import React, { useState, JSX } from 'react'
import localforage from 'localforage'
import { Container } from 'typescript-ioc'
import { CommandType, GroupType, MainConfig } from 'src/mainConfig'
import { IGroupContainerConfig, ISqlContentConfig } from 'src/component/sqlContentArea/sqlContent/sqlContentConfig'
import { CommandData, MessageType } from 'src/data/commandData'
import { DataModel } from 'src/model/dataModel'
import { SqlHandler } from 'src/core/sqlHandler/sqlHandler'

export interface ISqlContentControllerProps {
  id: string
  className: string
  commandType: CommandType
  textFromFileLoaded?: string
  fileName?: string
}

export interface ISqlContentControllerState {
  isInit: boolean
  pageContent: JSX.Element | null
}

export class SqlContentController extends React.Component<ISqlContentControllerProps> {
  protected dataModel: DataModel
  protected mainConfig: MainConfig
  protected sqlHandler: SqlHandler
  protected commandType: CommandType
  protected textFromFileLoaded: string = ''

  state: ISqlContentControllerState

  constructor (props: ISqlContentControllerProps) {
    super(props)
    this.state = {
      isInit: false,
      pageContent: null
    }
    this.mainConfig = Container.get(MainConfig)
    this.sqlHandler = new SqlHandler(props.commandType)
    this.dataModel = Container.get(DataModel)
    this.dataModel.tabContentControllerMap.set(props.commandType, this)
    this.commandType = props.commandType
    if (props.fileName) {
      this.dataModel.fileName = props.fileName
    }
    if (props.textFromFileLoaded) {
      this.textFromFileLoaded = props.textFromFileLoaded
      this.dataModel.setCommandValid(props.commandType, true)
      this.initLocalForge()
      this.initialize()
    }
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
    this.state = {
      isInit: false,
      pageContent: null
    }
    this.sqlHandler.transTextToCommand(this.textFromFileLoaded).then(() => {
      this.textFromFileLoaded = ''
      this.getPageContent().then((mainContainer) => {
        const overlay = document.getElementById('overlay') as HTMLDivElement
        overlay.style.display = 'none'
        this.setState({
          isInit: true,
          pageContent: mainContainer
        } as ISqlContentControllerState)
      })
    })
  }

  public updateNewPageContent (textFromFileLoaded: string, fileName: string): void {
    this.resetLocalForge().then(() => {
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

  protected getPageContent (): Promise<JSX.Element> {
    return new Promise<JSX.Element>(resolve => {
      const promistList: Promise<JSX.Element | null>[] = []

      const elementConfig: ISqlContentConfig = this.mainConfig.tabContentConfigMap.get(this.commandType) as ISqlContentConfig

      this.mainConfig.groupSettingMap.keys().forEach(groupName => {
        const promise = new Promise<JSX.Element | null>(resolve => {
          localforage.getItem(groupName + '-command').then((commands) => {
            if (!commands) {
              commands = []
            }
            this.getGroupContainer(groupName!, commands as CommandData[], elementConfig).then((groupContainer) => {
              resolve(groupContainer)
            })
          })
        })
        promistList.push(promise)
      })

      Promise.all(promistList).then((groupContainers) => {
        resolve(
          <div id={this.props.id} className={this.props.className}>
            <div id={elementConfig.mainContainer.contentContainer.id}>
              {groupContainers}
            </div>
          </div>
        )
      })
    })
  }

  protected async getGroupContainer (groupType: GroupType, commands: CommandData[], elementConfig: ISqlContentConfig): Promise<JSX.Element> {
    let isCheckGroup: boolean = false
    if (this.mainConfig.checkCommandGroup.has(this.commandType)) {
      const checkGroupTypes: GroupType[] = this.mainConfig.checkCommandGroup.get(this.commandType)
      isCheckGroup = checkGroupTypes.includes(groupType)
    }

    const config: IGroupContainerConfig = elementConfig.groupContainer

    let isGroupExist: boolean = true

    await localforage.getItem(groupType + '-command').then((items) => {
      if (!items) {
        isGroupExist = false
        this.dataModel.setCommandValid(this.commandType, false)
      }
    })

    const isTitleErrorStyle: boolean = !isGroupExist || this.sqlHandler.indicateCommandErrorMap.has(groupType) || (commands.length === 0 && isCheckGroup)

    const isShowCommand: boolean = commands.length > 0 && !this.sqlHandler.indicateCommandErrorMap.has(groupType)

    const isShowAmount: boolean = isShowCommand && groupType === GroupType.MainSQL

    const isShowAmountWarning: boolean = isShowAmount && commands.length >= this.mainConfig.maxGroupCommandAmount

    return (
      <div id={config.id.replace('{groupType}', groupType)} className={config.className}>
        <div id={config.commandContainer.id.replace('{groupType}', groupType)} className={config.commandContainer.className}>
          <p id={config.commandContainer.title.id.replace('{groupType}', groupType)} className={config.commandContainer.title.className + (isTitleErrorStyle ? ' command-error' : '')}>
            {this.mainConfig.groupSettingMap.get(groupType).title}
          </p>
          {isShowAmount ? this.getAmountText(commands) : null}
          {isShowAmountWarning ? this.getAmountWarningText() : null}
          {isShowCommand ? this.getCommandList(commands, groupType, config) : null}
        </div>
        <div id={config.messageContainer.id.replace('{groupType}', groupType)} className={config.messageContainer.className}>
          {this.getGroupErrorMessage(groupType, commands, config, isCheckGroup)}
          {this.getCommandMessages(commands, groupType, config)}
          {this.getNoGroupMessage(groupType, config, isGroupExist)}
        </div>
      </div>
    )
  }

  protected getAmountText (commands: CommandData[]): JSX.Element | null {
    return <p>{'語法數量 : ' + commands.length.toString()}</p>
  }

  protected getAmountWarningText (): JSX.Element | null {
    return <p>{'語法數量超過 ' + this.mainConfig.maxGroupCommandAmount.toString() + ' 筆, 以下區塊只顯示錯誤語法'}</p>
  }

  protected getCommandList (commands: CommandData[], groupType: GroupType, config: IGroupContainerConfig): JSX.Element | null {
    const CommandItem: React.FC<ICommandItemProps> = ({ command, index }) => {
      const [isHover, setHover] = useState(false)

      const handlePointerOver = () => setHover(true)
      const handlePointerOut = () => setHover(false)

      return (
        <p id={config.commandContainer.paragraph.id.replace('{groupType}', groupType).replace('{index}', index.toString())} className={'command-text pointerout-command' + (isHover ? ' pointerover-command' : ' pointerout-command')} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
          {(command.content as any)._strings.join('\r\n')}
        </p>
      )
    }

    return (
      <ul className='command-list'>{
        commands.map((command: CommandData, index: number) => {
          const showCommand = !(command.messages.length === 0 && commands.length >= this.mainConfig.maxGroupCommandAmount)
          if (showCommand) {
            if (command.messages.length > 0) {
              this.dataModel.setCommandValid(this.commandType, false)
            }
            return (
              <li key={'commandItem_' + index} className={'command' + (command.messages.length > 0 ? ' command-error' : '')}>
                <p className='num-of-item'>{(index + 1).toString()}</p>
                <CommandItem command={command} index={index} />
              </li>
            )
          }
          return null
        })
      }</ul>
    )
  }

  protected getGroupErrorMessage (groupType: GroupType, commands: CommandData[], config: IGroupContainerConfig, isCheckGroup: boolean): JSX.Element | null {
    if (this.sqlHandler.indicateCommandErrorMap.has(groupType)) {
      //* 顯示「區塊第一行沒有 SQL 命令標註字串」錯誤
      this.dataModel.setCommandValid(this.commandType, false)
      const commandIndex: number = this.sqlHandler.indicateCommandErrorMap.get(groupType).commandIndex
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
      let errorMessage = this.mainConfig.messageMap.get(MessageType.COMMAND_INDICATOR_NOT_FOUND_ERROR)
      errorMessage = errorMessage.replaceAll('{titleInMsg}', groupTitle)
      errorMessage = errorMessage.replaceAll('{textLineIndex}', (commandIndex + 1).toString())
      return (
        <span className={config.messageContainer.errorMessage.className}>{errorMessage}</span>
      )
    } else if (commands.length === 0 && isCheckGroup) {
      //* 顯示「沒有任何 SQL 命令」錯誤
      this.dataModel.setCommandValid(this.commandType, false)
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
      let errorMessage: string = this.mainConfig.messageMap.get(MessageType.CONTENT_NOT_FOUND_ERROR)
      errorMessage = errorMessage.replaceAll('{titleInMsg}', groupTitle)
      return (
        <span className={config.messageContainer.errorMessage.className}>{errorMessage}</span>
      )
    }
    return null
  }

  protected getCommandMessages (commands: CommandData[], groupType: GroupType, config: IGroupContainerConfig): (JSX.Element | null)[] {
    return commands.map((command: CommandData, index: number) => {
      if (command.messages.length > 0) {
        if (command.messages.length > 0) {
          command.messages.map(detail => {
            let message: string = this.mainConfig.messageMap.get(detail.messageType)
            const titleInMsg = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
            message = message.replaceAll('{titleInMsg}', titleInMsg)
            message = message.replaceAll('{sql_index}', (detail.commandIndex + 1).toString())
            message = message.replaceAll('{textLineIndex}', (detail.globalTextLineIndex + 1).toString())
            message = message.replaceAll('{command}', detail.command)
            return (
              <p className={config.messageContainer.errorMessage.className}>{message}</p>
            )
          })
        }
      }
      return null
    })
  }

  protected getNoGroupMessage (groupType: GroupType, config: IGroupContainerConfig, isGroupExist: boolean): JSX.Element | null {
    if (!isGroupExist) {
      let errorMessage: string = this.mainConfig.messageMap.get(MessageType.NO_GROUP_TAG)
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
      errorMessage = errorMessage.replaceAll('{titleInMsg}', groupTitle)
      return (
        <span className={config.messageContainer.errorMessage.className}>{errorMessage}</span>
      )
    }
    return null
  }

  render (): JSX.Element {
    return (
      this.state.pageContent as JSX.Element
    )
  }
}

interface ICommandItemProps {
  command: CommandData
  index: number
}
