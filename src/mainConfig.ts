import { Singleton } from 'typescript-ioc'
import { TSMap } from 'typescript-map'
import { ISqlContentConfig, SqlContentConfig } from 'src/component/sqlContentArea/sqlContent/sqlContentConfig'
import { MessageType } from 'src/data/commandData'
import { RegExpMapConfig, RegExpConfig } from 'src/config/regExpConfig'

export interface IMainConfig {
  checkCommandGroup: TSMap<CommandType, GroupType[]>
  groupSettingMap: TSMap<GroupType, IGroupSetting>
  singleCommandIndicator: string
  validCommandMap: TSMap<CommandType, TSMap<GroupType, TSMap<string, RegExp>>>
  invalidCommandMap: TSMap<CommandType, TSMap<GroupType, TSMap<string, RegExp>>>
  tabContentConfigMap: TSMap<CommandType, ISqlContentConfig>
  messageMap: TSMap<MessageType, string>
  ddlComplexCommandStartRegExp: RegExp
  ddlComplexCommandEnds: string[]
  grantRevokeCommand: { regExp: RegExp, command: string }
  maxGroupCommandAmount: number
  useAllRegExpCheckMultiCommand: boolean
  checkAllGroupExist: boolean
}

export interface IGroupSetting {
  title: string
  titleInMsg: string
  indicator: string
  searchEndPattern: string[]
}

export enum GroupType {
  PreSQL = 'PreSQL',
  PreProdSQL = 'PreProdSQL',
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

@Singleton
export class MainConfig implements IMainConfig {
  protected regExpConig = new RegExpMapConfig()
  public groupSettingMap: TSMap<GroupType, IGroupSetting> = new TSMap<GroupType, IGroupSetting>([
    [
      GroupType.PreSQL, {
        title: '前置語法',
        titleInMsg: '前置語法 (PreSQL) ',
        indicator: '--#PreSQL',
        searchEndPattern: ['--#PreProdSQL', '--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.PreProdSQL, {
        title: 'PreProd 前置語法',
        titleInMsg: 'PreProd前置語法 (PreProdSQL) ',
        indicator: '--#PreProdSQL',
        searchEndPattern: ['--#PreSQL', '--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.CountSQL, {
        title: 'Count 語法',
        titleInMsg: 'Count 語法 (CountSQL) ',
        indicator: '--#CountSQL',
        searchEndPattern: ['--#PreSQL', '--#PreProdSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.SelectSQL, {
        title: '異動前/後語法',
        titleInMsg: '異動前/後語法 (SelectSQL) ',
        indicator: '--#SelectSQL',
        searchEndPattern: ['--#PreSQL', '--#PreProdSQL', '--#CountSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.MainSQL, {
        title: '異動語法',
        titleInMsg: '異動語法 (MainSQL) ',
        indicator: '--#MainSQL',
        searchEndPattern: ['--#PreSQL', '--#PreProdSQL', '--#CountSQL', '--#SelectSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.PostSQL, {
        title: '後置語法',
        titleInMsg: '後置語法 (PostSQL) ',
        indicator: '--#PostSQL',
        searchEndPattern: ['--#PreSQL', '--#PreProdSQL', '--#CountSQL', '--#SelectSQL', '--#MainSQL']
      }
    ]
  ])

  public singleCommandIndicator: string = '/*--!*/'

  public validCommandMap: TSMap<CommandType, TSMap<GroupType, TSMap<string, RegExp>>> = new TSMap<CommandType, TSMap<GroupType, TSMap<string, RegExp>>>([
    [
      CommandType.DDL, new TSMap<GroupType, TSMap<string, RegExp>>([
        ...this.regExpConig.validRegExpMapDDL.entries()
      ])
    ],
    [
      CommandType.DML, new TSMap<GroupType, TSMap<string, RegExp>>([
        ...this.regExpConig.validRegExpMapDML.entries()
      ])
    ]
  ])

  public invalidCommandMap: TSMap<CommandType, TSMap<GroupType, TSMap<string, RegExp>>> = new TSMap<CommandType, TSMap<GroupType, TSMap<string, RegExp>>>([
    [
      CommandType.DDL, new TSMap<GroupType, TSMap<string, RegExp>>([
        ...this.regExpConig.invalidRegExpMapDDL.entries()
      ])
    ],
    [
      CommandType.DML, new TSMap<GroupType, TSMap<string, RegExp>>([
        ...this.regExpConig.invalidRegExpMapDML.entries()
      ])
    ]
  ])

  public tabContentConfigMap: TSMap<CommandType, ISqlContentConfig> = new TSMap<CommandType, ISqlContentConfig>([
    [
      CommandType.DML, new SqlContentConfig(CommandType.DML)
    ],
    [
      CommandType.DDL, new SqlContentConfig(CommandType.DDL)
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
      MessageType.NO_GROUP_TAG,
      '[ {titleInMsg} ]\n找不到 "{titleInMsg}" 區塊. 請檢查 SQL 檔案是否存在該區塊的註解標籤。'
    ],
    [
      MessageType.CONTENT_NOT_FOUND_ERROR,
      '[ {titleInMsg} ]\n此區塊並未找到任何語法. 請檢查 SQL 檔案是否有包含該區塊指令。'
    ],
    [
      MessageType.INVALID_COMMAND_ERROR,
      '[ {titleInMsg}, sql_index = {sql_index}, 原始文件行數 = {textLineIndex} ]\n此區塊不允許使用 "{command}" 語法。請移除相關的語法。'
    ],
    [
      MessageType.NO_VALID_COMMAND_ERROR,
      '[ {titleInMsg}, sql_index = {sql_index}, 原始文件行數 = {textLineIndex} ]\n"找不到此區塊允許使用的語法。請檢查語法是否拼錯、或者使用了不合規的語法。'
    ],
    [
      MessageType.EXCEENDS_COMMAND_LIMIT_ERROR,
      '[ {titleInMsg}, sql_index = {sql_index}, 原始文件行數 = {textLineIndex} ]\n"不得在 SQL 指令標記 (/*--!*/) 底下放置兩筆以上的語法。'
    ],
    [
      MessageType.EMPTY_OR_COMMENT_ONLY_ERROR,
      '[ {titleInMsg}, sql_index = {sql_index}, 原始文件行數 = {textLineIndex} ]\n"不得在 SQL 指令標記下只放置單行的空白字串或註解。'
    ],
    [
      MessageType.COMMAND_INDICATOR_NOT_FOUND_ERROR,
      '[ {titleInMsg}, 原始文件行數 = {textLineIndex} ]\n SQL 指令標記 (/*--!*/) 有誤. 請檢查 SQL 檔案第一筆指令是否有做標註。'
    ]
  ])

  public ddlComplexCommandStartRegExp: RegExp = /^\s*(CREATE|ALTER|DROP)(\s+OR\s+REPLACE)?\s+(.*\s+)?(PROCEDURE|FUNCTION|TRIGGER|PACKAGE|VIEW)/

  public ddlComplexCommandEnds: string[] = ['/', 'END', 'END;']

  public grantRevokeCommand: { regExp: RegExp, command: string } = {
    regExp: RegExpConfig.GRANT_REVOKE_REGEXP,
    command: 'GRANT / REVOKE'
  }

  public maxGroupCommandAmount: number = 20000

  public useAllRegExpCheckMultiCommand: boolean = false

  public firstCommandIsNextToGroupName: boolean = true

  public checkAllGroupExist: boolean = true
}
