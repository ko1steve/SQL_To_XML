import { ITabContentConfig, TabContentConfig } from "./component/tabContent/tabContentConfig"
import { ErrorType } from 'src/element/CommandData'


export class MainConfig implements IMainConfig {

  public groupShowOrder: GroupType[] = [GroupType.PreSQL, GroupType.CountSQL, GroupType.SelectSQL, GroupType.MainSQL, GroupType.PostSQL]

  public groupSettingMap: Map<GroupType, IGroupSetting> = new Map<GroupType, IGroupSetting>([
    [
      GroupType.PreSQL, {
        title: '前置宣告',
        indicator: '--#PreSQL',
        searchEndPattern: ['--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      } as IGroupSetting
    ],
    [
      GroupType.CountSQL, {
        title: 'Count語法',
        indicator: '--#CountSQL',
        searchEndPattern: ['--#PreSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      } as IGroupSetting
    ],
    [
      GroupType.SelectSQL, {
        title: '異動前/後語法',
        indicator: '--#SelectSQL',
        searchEndPattern: ['--#PreSQL', '--#CountSQL', '--#MainSQL', '--#PostSQL']
      } as IGroupSetting
    ],
    [
      GroupType.MainSQL, {
        title: '異動語法',
        indicator: '--#MainSQL',
        searchEndPattern: ['--#PreSQL', '--#CountSQL', '--#SelectSQL', '--#PostSQL']
      } as IGroupSetting
    ],
    [
      GroupType.PostSQL, {
        title: '後置語法',
        indicator: '--#PostSQL',
        searchEndPattern: ['--#PreSQL', '--#CountSQL', '--#SelectSQL', '--#MainSQL']
      } as IGroupSetting
    ]
  ])

  public singleCommandIndicator: string = '/*--!*/'

  public ignoredCommands: string[] = ['GO']

  public invalidCommands: string[] = ['COMMIT']

  public tabContentConfigMap: Map<CommandType, ITabContentConfig> = new Map<CommandType, ITabContentConfig>([
    [
      CommandType.DML, new TabContentConfig(CommandType.DML)
    ],
    [
      CommandType.DDL, new TabContentConfig(CommandType.DDL)
    ]
  ])

  public checkCommandGroup: Map<CommandType, GroupType[]> = new Map<CommandType, GroupType[]>([
    [
      CommandType.DML, [
        GroupType.CountSQL, GroupType.SelectSQL, GroupType.MainSQL
      ]
    ],
    [
      CommandType.DDL, [
        GroupType.MainSQL
      ]
    ]
  ])

  public errorMessageMap: Map<ErrorType, string> = new Map<ErrorType, string>([
    [
      ErrorType.CONTENT_NOT_FOUND_ERROR,
      '[{groupType}] ContentNotFoundError: "{groupTitle}" is not defind. 請檢查 SQL 檔案是否有包含該類別的指令。'
    ],
    [
      ErrorType.INVALID_COMMAND_ERROR,
      '[{groupType}, {index}] InvalidCommandError: "{command}" is not allowed. 請移除相關的指令。'
    ]
  ])

}

export interface IMainConfig {
  groupShowOrder: GroupType[]
  checkCommandGroup: Map<CommandType, GroupType[]>
  groupSettingMap: Map<GroupType, IGroupSetting>
  singleCommandIndicator: string
  ignoredCommands: string[]
  invalidCommands: string[]
  tabContentConfigMap: Map<CommandType, ITabContentConfig>
  errorMessageMap: Map<ErrorType, string>
}

export interface IGroupSetting {
  title: string
  indicator: string
  searchEndPattern: string[]
}

export enum GroupType {
  PreSQL = 'PreSQL',
  CountSQL = 'CountSQL',
  SelectSQL = 'SelectSQL',
  MainSQL = 'MainSQL',
  PostSQL = 'PostSQL'
}

export enum CommandType {
  DML = 'DML',
  NONE = 'NONE',
  DDL = 'DDL'
}