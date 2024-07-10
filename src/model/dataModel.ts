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
  }

  constructor () {
    this._tabContentControllerMap = new TSMap()
    this._currentTab = CommandType.DML
  }
}
