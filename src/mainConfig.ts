import { ISqlContentConfig, SqlContentConfig } from 'src/core/sqlContent/sqlContentConfig'
import { MessageType } from 'src/config/commandData'
import { TSMap } from 'typescript-map'
import { RegExpConig, GRANT_REVOKE_REGEXP } from './config/regExpConfig'

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
}

export interface IGroupSetting {
  title: string
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

export class MainConfig implements IMainConfig {
  protected regExpConig = new RegExpConig()
  public groupSettingMap: TSMap<GroupType, IGroupSetting> = new TSMap<GroupType, IGroupSetting>([
    [
      GroupType.PreSQL, {
        title: '前置語法',
        indicator: '--#PreSQL',
        searchEndPattern: ['--#PreProdSQL', '--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.PreProdSQL, {
        title: 'PreProd前置語法',
        indicator: '--#PreProdSQL',
        searchEndPattern: ['--#PreSQL', '--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.CountSQL, {
        title: 'Count語法',
        indicator: '--#CountSQL',
        searchEndPattern: ['--#PreSQL', '--#PreProdSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.SelectSQL, {
        title: '異動前/後語法',
        indicator: '--#SelectSQL',
        searchEndPattern: ['--#PreSQL', '--#PreProdSQL', '--#CountSQL', '--#MainSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.MainSQL, {
        title: '異動語法',
        indicator: '--#MainSQL',
        searchEndPattern: ['--#PreSQL', '--#PreProdSQL', '--#CountSQL', '--#SelectSQL', '--#PostSQL']
      }
    ],
    [
      GroupType.PostSQL, {
        title: '後置語法',
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
      MessageType.CONTENT_NOT_FOUND_ERROR,
      '[{groupTitle}]\nContentNotFoundError: "{groupTitle}"尚未在 SQL 文件內定義. 請檢查 SQL 檔案是否有包含該類別的指令。'
    ],
    [
      MessageType.INVALID_COMMAND_ERROR,
      '[{groupTitle}, sql_index = {sql_index}, 行數 = {textLineIndex}]\nInvalidCommandError: 不允許使用 "{command}" 語法。請移除相關的語法。'
    ],
    [
      MessageType.NO_VALID_COMMAND_ERROR,
      '[{groupTitle}, sql_index = {sql_index}, 行數 = {textLineIndex}]\nNoValidCommandError: "找不到符合語法規則的語法。請檢查語法是否拼錯、或者使用了不合規的語法。'
    ],
    [
      MessageType.EXCEENDS_COMMAND_LIMIT_ERROR,
      '[{groupTitle}, sql_index = {sql_index}, 行數 = {textLineIndex}]\nExceedsCommandLimitError: "不能在一個語法標記(/*--!*/)底下放置兩筆以上的語法。'
    ],
    [
      MessageType.EMPTY_OR_COMMENT_ONLY_ERROR,
      '[{groupTitle}, sql_index = {sql_index}, 行數 = {textLineIndex}]\nEmptyOrCommentOnlyError: "不能空白字串或純註解。'
    ]
  ])

  public ddlComplexCommandStartRegExp: RegExp = /^\s*(CREATE|ALTER|DROP)(\s+OR\s+REPLACE)?\s+(.*\s+)?(PROCEDURE|FUNCTION|TRIGGER|PACKAGE|VIEW)/

  public ddlComplexCommandEnds: string[] = ['/', 'END', 'END;']

  public grantRevokeCommand: { regExp: RegExp, command: string } = {
    regExp: GRANT_REVOKE_REGEXP,
    command: 'GRANT / REVOKE'
  }

  public maxGroupCommandAmount: number = 20000

  public useAllRegExpCheckMultiCommand: boolean = false
}
