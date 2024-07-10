import { MiniSignal } from 'mini-signals'
import { SqlContentController } from 'src/core/sqlContent/sqlContentController'
import { CommandType } from 'src/mainConfig'
import { Singleton } from 'typescript-ioc'
import { TSMap } from 'typescript-map'

@Singleton
export class DataModel {
  private _tabContentControllerMap: TSMap<CommandType, SqlContentController>

  public get tabContentControllerMap (): TSMap<CommandType, SqlContentController> {
    return this._tabContentControllerMap
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
  public onCommandValidChangeSignal: MiniSignal

  constructor () {
    this._tabContentControllerMap = new TSMap()
    this._currentTab = CommandType.DML
    this._isCommandValidMap = new TSMap<CommandType, boolean>([
      [CommandType.DDL, false],
      [CommandType.DML, false]
    ])
    this.onTabChangeSignal = new MiniSignal()
    this.onCommandValidChangeSignal = new MiniSignal()
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
