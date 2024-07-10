import { TabContentController } from 'src/component/tabContent/tabContentController'
import { CommandType } from 'src/mainConfig'
import { Singleton } from 'typescript-ioc'
import { TSMap } from 'typescript-map'

@Singleton
export class DataModel {
  private _tabContentControllerMap: TSMap<CommandType, TabContentController>
  public get tabContentControllerMap (): TSMap<CommandType, TabContentController> {
    return this._tabContentControllerMap
  }

  constructor () {
    this._tabContentControllerMap = new TSMap()
  }
}
