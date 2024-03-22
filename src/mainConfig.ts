import { ITabContentConfig, TabContentConfig } from './component/tabContent/tabContentConfig'
import { MessageType } from 'src/element/CommandData'

export interface IMainConfig {
  groupShowOrder: GroupType[]
  checkCommandGroup: Map<CommandType, GroupType[]>
  groupSettingMap: Map<GroupType, IGroupSetting>
  singleCommandIndicator: string
  ignoredCommandMap: Map<CommandType, Map<string, RegExp>>
  invalidCommandMap: Map<CommandType, Map<string, RegExp>>
  tabContentConfigMap: Map<CommandType, ITabContentConfig>
  messageMap: Map<MessageType, string>
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

  public ignoredCommandMap: Map<CommandType, Map<string, RegExp>> = new Map<CommandType, Map<string, RegExp>>([
    //* [唯一|開頭|結尾|句中]
    [
      CommandType.DDL, new Map<string, RegExp>([
        [
          'GO', /^GO$|^GO[^\w]|[^\w]GO;*$|[^\w]+GO[^\w]+/
        ]
      ])
    ],
    [
      CommandType.DML, new Map<string, RegExp>([
        [
          'GO', /^GO$|^GO[^\w]|[^\w]GO;*$|[^\w]+GO[^\w]+/
        ]
      ])
    ]
  ])

  public invalidCommandMap: Map<CommandType, Map<string, RegExp>> = new Map<CommandType, Map<string, RegExp>>([
    [
      CommandType.DDL, new Map<string, RegExp>([
        [
          'COMMIT', /^COMMIT$|^COMMIT\s+|\s+COMMIT\s+|\s+COMMIT$/
        ],
        [
          'UPDATE', /^UPDATE$|^UPDATE\s+|\s+UPDATE\s+|\s+UPDATE$/
        ],
        [
          'DELETE', /^DELETE$|^DELETE\s+|\s+DELETE\s+|\s+DELETE$/
        ],
        [
          'INSERT', /^INSERT$|^INSERT\s+|\s+INSERT\s+|\s+INSERT$/
        ],
        [
          'SELECT', /^SELECT$|^SELECT\s+|\s+SELECT\s+|\s+SELECT$/
        ]
      ])
    ],
    [
      CommandType.DML, new Map<string, RegExp>([
        [
          'COMMIT', /^COMMIT\s+|\s+COMMIT\s+|\s+COMMIT$/
        ],
        [
          'CREATE', /^CREATE\s+|\s+CREATE\s+|\s+CREATE$/
        ],
        [
          'ALTER', /^ALTER\s+|\s+ALTER\s+|\s+ALTER$/
        ],
        [
          'DROP', /^DROP\s+|\s+DROP\s+|\s+DROP$/
        ],
        [
          'TRUNCATE', /^TRUNCATE\s+|\s+TRUNCATE\s+|\s+TRUNCATE$/
        ]
      ])
    ]
  ])

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

  public messageMap: Map<MessageType, string> = new Map<MessageType, string>([
    [
      MessageType.IGNORED_COMMAND,
      '[{groupType}, {index}] IgnoredCommand: Command "{command}" has been commented out.'
    ],
    [
      MessageType.CONTENT_NOT_FOUND_ERROR,
      '[{groupType}] ContentNotFoundError: "{groupTitle}" is not defind. 請檢查 SQL 檔案是否有包含該類別的指令。'
    ],
    [
      MessageType.INVALID_COMMAND_ERROR,
      '[{groupType}, {index}] InvalidCommandError: "{command}" is not allowed. 請移除相關的指令。'
    ]
  ])
}
