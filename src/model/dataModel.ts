import { MiniSignal } from 'mini-signals'
import { Singleton } from 'typescript-ioc'
import { TSMap } from 'typescript-map'
import { CommandType } from 'src/mainConfig'
import { SqlContentController } from 'src/component/sqlContentArea/sqlContent/sqlContentController'

@Singleton
export class DataModel {
  private _tabContentControllerMap: TSMap<CommandType, SqlContentController>

  public get tabContentControllerMap (): TSMap<CommandType, SqlContentController> {
    return this._tabContentControllerMap
  }

  private _fileName: string

  public get fileName (): string {
    return this._fileName
  }

  public set fileName (value: string) {
    this._fileName = value
  }

  private _currentTab: CommandType

  public get currentTab (): CommandType {
    return this._currentTab
  }

  public set currentTab (value: CommandType) {
    this._currentTab = value
    this.onTabChangeSignal.dispatch(value)
  }

  private _isCommandValidMap: TSMap<CommandType, boolean>

  public onTabChangeSignal: MiniSignal
  public onTextFromFileLoadedChangeSignal: MiniSignal
  public onCommandValidChangeSignal: MiniSignal
  public onStartLoadSignal: MiniSignal
  public onCompleteLoadSignal: MiniSignal

  constructor () {
    this._tabContentControllerMap = new TSMap()
    this._currentTab = CommandType.DML
    this._isCommandValidMap = new TSMap<CommandType, boolean>([
      [
        CommandType.DDL, false
      ],
      [
        CommandType.DML, false
      ]
    ])
    this.onTabChangeSignal = new MiniSignal()
    this.onTextFromFileLoadedChangeSignal = new MiniSignal()
    this.onCommandValidChangeSignal = new MiniSignal()
    this.onStartLoadSignal = new MiniSignal()
    this.onCompleteLoadSignal = new MiniSignal()
    this._fileName = ''
  }

  public getCommandValid (commandType: CommandType): boolean {
    return this._isCommandValidMap.get(commandType)
  }

  public setCommandValid (commandType: CommandType, isValid: boolean): void {
    if (!this._isCommandValidMap.has(commandType) || this._isCommandValidMap.get(commandType) === isValid) {
      return
    }
    this._isCommandValidMap.set(commandType, isValid)
    this.onCommandValidChangeSignal.dispatch({ commandType, isValid })
  }
}
