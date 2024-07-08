import { ITabContentConfig, TabContentConfig } from './component/tabContent/tabContentConfig'
import { MessageType } from 'src/element/CommandData'
import { TSMap } from 'typescript-map'
import { RegExpConig } from './config/regExpConfig'

export interface IMainConfig {
  checkCommandGroup: TSMap<CommandType, GroupType[]>
  groupSettingMap: TSMap<GroupType, IGroupSetting>
  singleCommandIndicator: string
  validCommandMap: TSMap<CommandType, TSMap<GroupType, TSMap<string, RegExp>>>
  invalidCommandMap: TSMap<CommandType, TSMap<GroupType, TSMap<string, RegExp>>>
  tabContentConfigMap: TSMap<CommandType, ITabContentConfig>
  messageMap: TSMap<MessageType, string>
  enableTrimCommand: boolean
  ddlComplexCommandStart: RegExp
  maxGroupCommandAmount: number
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
      MessageType.CONTENT_NOT_FOUND_ERROR,
      '{groupTitle}\n ContentNotFoundError: "{groupTitle}" is not defind. 請檢查 SQL 檔案是否有包含該類別的指令。'
    ],
    [
      MessageType.INVALID_COMMAND_ERROR,
      '{groupTitle}, index = {index}\n InvalidCommandError: "{command}" is not allowed. 請移除相關的指令。'
    ],
    [
      MessageType.NO_VALID_COMMAND_ERROR,
      '{groupTitle}, index = {index}\n NoValidCommandError: "找不到任何符合語法規則的語法。請檢查是否語法拼錯，或是同時包含兩筆以上的語法。'
    ],
    [
      MessageType.EXCEENDS_COMMAND_LIMIT_ERROR,
      '{groupTitle}, index = {index}\n ExceedsCommandLimitError: "不能在一個語法標記(/*--!*/)底下放置兩筆以上的語法。'
    ]
  ])

  public enableTrimCommand: boolean = true
  public ddlComplexCommandStart: RegExp = /^\s*(CREATE|ALTER|DROP)(\s+OR\s+REPLACE)?\s+(.*\s+)?(PROCEDURE|FUNCTION|TRIGGER|PACKAGE|VIEW)/
  public maxGroupCommandAmount: number = 20000
}
