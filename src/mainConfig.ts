import { ITabContentConfig, TabContentConfig } from './component/tabContent/tabContentConfig'
import { MessageType } from 'src/element/CommandData'
import { TSMap } from 'typescript-map'

export interface IMainConfig {
  checkCommandGroup: TSMap<CommandType, GroupType[]>
  groupSettingMap: TSMap<GroupType, IGroupSetting>
  singleCommandIndicator: string
  ignoredCommandMap: TSMap<CommandType, TSMap<string, RegExp>>
  invalidCommandMap: TSMap<CommandType, TSMap<string, RegExp>>
  tabContentConfigMap: TSMap<CommandType, ITabContentConfig>
  messageMap: TSMap<MessageType, string>
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
  public groupSettingMap: TSMap<GroupType, IGroupSetting> = new TSMap<GroupType, IGroupSetting>([
    [
      GroupType.PreSQL, {
        title: '前置宣告',
        indicator: '--#PreSQL',
        searchEndPattern: ['--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.CountSQL, {
        title: 'Count語法',
        indicator: '--#CountSQL',
        searchEndPattern: ['--#PreSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.SelectSQL, {
        title: '異動前/後語法',
        indicator: '--#SelectSQL',
        searchEndPattern: ['--#PreSQL', '--#CountSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.MainSQL, {
        title: '異動語法',
        indicator: '--#MainSQL',
        searchEndPattern: ['--#PreSQL', '--#CountSQL', '--#SelectSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.PostSQL, {
        title: '後置語法',
        indicator: '--#PostSQL',
        searchEndPattern: ['--#PreSQL', '--#CountSQL', '--#SelectSQL', '--#MainSQL']
      }
    ]
  ])

  public singleCommandIndicator: string = '/*--!*/'

  public ignoredCommandMap: TSMap<CommandType, TSMap<string, RegExp>> = new TSMap<CommandType, TSMap<string, RegExp>>([
    //* [唯一|開頭|結尾|句中]
    [
      CommandType.DDL, new TSMap<string, RegExp>([
        [
          'GO', /^GO$|^GO[^\w]|[^\w]GO;*$|[^\w]+GO[^\w]+/
        ]
      ])
    ],
    [
      CommandType.DML, new TSMap<string, RegExp>([
        [
          'GO', /^GO$|^GO[^\w]|[^\w]GO;*$|[^\w]+GO[^\w]+/
        ]
      ])
    ]
  ])

  public invalidCommandMap: TSMap<CommandType, TSMap<string, RegExp>> = new TSMap<CommandType, TSMap<string, RegExp>>([
    [
      CommandType.DDL, new TSMap<string, RegExp>([
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
      CommandType.DML, new TSMap<string, RegExp>([
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

  public tabContentConfigMap: TSMap<CommandType, ITabContentConfig> = new TSMap<CommandType, ITabContentConfig>([
    [
      CommandType.DML, new TabContentConfig(CommandType.DML)
    ],
    [
      CommandType.DDL, new TabContentConfig(CommandType.DDL)
    ]
  ])

  public checkCommandGroup: TSMap<CommandType, GroupType[]> = new TSMap<CommandType, GroupType[]>([
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

  public messageMap: TSMap<MessageType, string> = new TSMap<MessageType, string>([
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
