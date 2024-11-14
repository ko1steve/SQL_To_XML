import React, { useState, JSX } from 'react'
import { Container } from 'typescript-ioc'
import { CommandType, GroupType, MainConfig } from 'src/mainConfig'
import { IGroupContainerConfig, ISqlContentConfig } from 'src/component/sqlContentArea/sqlContent/sqlContentConfig'
import { ICommandData, MessageType } from 'src/data/commandData'
import { DataModel } from 'src/model/dataModel'
import { SqlHandler } from 'src/core/sqlHandler/sqlHandler'

export interface ISqlContentControllerProps {
  id: string
  className: string
  commandType: CommandType
}

export interface ISqlContentControllerState {
  isInit: boolean
}

export class SqlContentController extends React.Component<ISqlContentControllerProps, ISqlContentControllerState> {
  protected dataModel: DataModel
  protected mainConfig: MainConfig
  protected elementConfig: ISqlContentConfig
  protected sqlHandler: SqlHandler
  protected mainContainer: JSX.Element

  state: ISqlContentControllerState

  constructor (props: ISqlContentControllerProps) {
    super(props)
    this.mainConfig = Container.get(MainConfig)
    this.elementConfig = this.mainConfig.tabContentConfigMap.get(this.props.commandType) as ISqlContentConfig
    this.sqlHandler = new SqlHandler(props.commandType)
    this.dataModel = Container.get(DataModel)
    this.dataModel.tabContentControllerMap.set(props.commandType, this)
    this.mainContainer = <div></div>
    this.state = {
      isInit: false
    }
  }

  protected initialize (): void {
    this.dataModel.setCommandValid(this.props.commandType, false)
    this.dataModel.onCompleteLoadSignal.dispatch()
    this.mainContainer = this.getEmptyContainer()
    this.setState({
      isInit: true
    })
  }

  protected getEmptyContainer (): JSX.Element {
    return (
      <div id={this.props.id} className={this.props.className}>
        <div id={this.elementConfig.mainContainer.contentContainer.id}>
        </div>
      </div>
    )
  }

  public updatePageContent (textFromFileLoaded: string): void {
    this.sqlHandler.reset()
    this.mainContainer = <div></div>
    this.setState({
      isInit: false
    })
    this.dataModel.setCommandValid(this.props.commandType, true)
    this.sqlHandler.transTextToCommand(textFromFileLoaded!).then(() => {
      this.getPageContent().then((mainContainer) => {
        this.dataModel.onCompleteLoadSignal.dispatch()
        this.mainContainer = mainContainer
        this.setState({
          isInit: true
        })
      })
    })
  }

  protected getPageContent (): Promise<JSX.Element> {
    return new Promise<JSX.Element>(resolve => {
      const promistList: Promise<JSX.Element | null>[] = []
      this.mainConfig.groupSettingMap.keys().forEach(groupType => {
        const promise = new Promise<JSX.Element | null>(resolve => {
          this.sqlHandler.getItem<ICommandData[] | null>(groupType + '-command').then((commands) => {
            if (!commands) {
              commands = []
            }
            this.getGroupContainer(groupType!, commands, this.elementConfig).then((groupContainer) => {
              resolve(groupContainer)
            })
          })
        })
        promistList.push(promise)
      })

      Promise.all(promistList).then((groupContainers) => {
        resolve(
          <div id={this.props.id} className={this.props.className}>
            <div id={this.elementConfig.mainContainer.contentContainer.id}>
              {groupContainers}
            </div>
          </div>
        )
      })
    })
  }

  protected async getGroupContainer (groupType: GroupType, commands: ICommandData[], elementConfig: ISqlContentConfig): Promise<JSX.Element> {
    let isCheckGroup: boolean = false
    if (this.mainConfig.checkCommandGroup.has(this.props.commandType)) {
      const checkGroupTypes: GroupType[] = this.mainConfig.checkCommandGroup.get(this.props.commandType)
      isCheckGroup = checkGroupTypes.includes(groupType)
    }

    const config: IGroupContainerConfig = elementConfig.groupContainer

    let isGroupExist: boolean = true

    await this.sqlHandler.getItem<ICommandData[] | null>(groupType + '-command').then((commands) => {
      if (!commands) {
        isGroupExist = false
        this.dataModel.setCommandValid(this.props.commandType, false)
      }
    })

    let isTitleErrorStyle: boolean = !isGroupExist || this.sqlHandler.indicateCommandErrorMap.has(groupType) || (commands.length === 0 && isCheckGroup)

    for (let i = 0; i < commands.length; i++) {
      if (commands[i].messages.length > 0) {
        this.dataModel.setCommandValid(this.props.commandType, false)
        isTitleErrorStyle = true
      }
    }

    const isShowCommand: boolean = commands.length > 0 && !this.sqlHandler.indicateCommandErrorMap.has(groupType)

    const isShowAmount: boolean = isShowCommand && groupType === GroupType.MainSQL

    const isShowAmountWarning: boolean = isShowAmount && commands.length >= this.mainConfig.maxGroupCommandAmount

    return (
      <div key={'groupContainer-' + groupType} id={config.id.replace('{groupType}', groupType)} className={config.className}>
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

  protected getAmountText (commands: ICommandData[]): JSX.Element | null {
    return <p>{'語法數量 : ' + commands.length.toString()}</p>
  }

  protected getAmountWarningText (): JSX.Element | null {
    return <p>{'語法數量超過 ' + this.mainConfig.maxGroupCommandAmount.toString() + ' 筆, 以下區塊只顯示錯誤語法'}</p>
  }

  protected getCommandList (commands: ICommandData[], groupType: GroupType, config: IGroupContainerConfig): JSX.Element | null {
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
        commands.map((command: ICommandData, index: number) => {
          const showCommand = !(command.messages.length === 0 && commands.length >= this.mainConfig.maxGroupCommandAmount)
          if (showCommand) {
            return (
              <li key={'commandItem-' + index} className={'command' + (command.messages.length > 0 ? ' command-error' : '')}>
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

  protected getGroupErrorMessage (groupType: GroupType, commands: ICommandData[], config: IGroupContainerConfig, isCheckGroup: boolean): JSX.Element | null {
    if (this.sqlHandler.indicateCommandErrorMap.has(groupType)) {
      this.dataModel.setCommandValid(this.props.commandType, false)
      const commandIndex: number = this.sqlHandler.indicateCommandErrorMap.get(groupType).commandIndex
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
      let errorMessage = this.mainConfig.messageMap.get(MessageType.COMMAND_INDICATOR_NOT_FOUND_ERROR)
      errorMessage = errorMessage.replaceAll('{titleInMsg}', groupTitle)
      errorMessage = errorMessage.replaceAll('{textLineIndex}', (commandIndex + 1).toString())
      return (
        <span className={config.messageContainer.errorMessage.className}>{errorMessage}</span>
      )
    } else if (commands.length === 0 && isCheckGroup) {
      this.dataModel.setCommandValid(this.props.commandType, false)
      const groupTitle: string = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
      let errorMessage: string = this.mainConfig.messageMap.get(MessageType.CONTENT_NOT_FOUND_ERROR)
      errorMessage = errorMessage.replaceAll('{titleInMsg}', groupTitle)
      return (
        <span className={config.messageContainer.errorMessage.className}>{errorMessage}</span>
      )
    }
    return null
  }

  protected getCommandMessages (commands: ICommandData[], groupType: GroupType, config: IGroupContainerConfig): JSX.Element[] {
    const messageElements: JSX.Element[] = []
    commands.forEach((command: ICommandData) => {
      if (command.messages.length > 0) {
        command.messages.forEach(detail => {
          let message: string = this.mainConfig.messageMap.get(detail.messageType)
          const titleInMsg = this.mainConfig.groupSettingMap.get(groupType).titleInMsg
          message = message.replaceAll('{titleInMsg}', titleInMsg)
          message = message.replaceAll('{sql_index}', (detail.commandIndex + 1).toString())
          message = message.replaceAll('{textLineIndex}', (detail.globalTextLineIndex + 1).toString())
          message = message.replaceAll('{command}', detail.command)
          messageElements.push(<p className={config.messageContainer.errorMessage.className}>{message}</p>)
        })
      }
    })
    return (
      messageElements
    )
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
      this.mainContainer
    )
  }
}

interface ICommandItemProps {
  command: ICommandData
  index: number
}
