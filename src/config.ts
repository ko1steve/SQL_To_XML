

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

  public elementConfigMap: Map<CommandType, IElementConifg> = new Map<CommandType, IElementConifg>([
    [
      CommandType.DML, {
        allGroupContainer: {
          id: 'allGroupContainer-DML',
          className: 'container text-center',
          groupContainer: {
            className: 'groupContainer row',
            warningMessageContainer: {
              id: 'warningMessageContainer-DML',
              className: 'col-2 col-md-3 warningContainer'
            },
            commandContainer: {
              id: 'commandContainer-{groupType}-DML',
              className: 'col-8 col-md-6 commandContainer',
              title: {
                id: '{groupType}-title-DML',
                className: 'fw-bold fs-3'
              },
              paragraph: {
                id: '{groupType}-command-{index}-DML',
                className: 'command'
              }
            },
            errorMessageContainer: {
              id: 'errorMessageContainer-DML',
              className: 'col-2 col-md-3 errorMessageContainer',
              errorMessage: {
                className: 'error-message'
              }
            }
          }
        },
        downloadButtonContainer: {
          id: 'downloadButtonContainer-DML',
          className: 'container',
          downloadButton: {
            className: 'downloadButton',
            textContent: 'Download as XML'
          }
        }
      } as IElementConifg
    ],
    [
      CommandType.DDL, {
        allGroupContainer: {
          id: 'allGroupContainer-DDL',
          className: 'container text-center',
          groupContainer: {
            className: 'groupContainer row',
            warningMessageContainer: {
              id: 'warningMessageContainer-DDL',
              className: 'col-2 col-md-3 warningContainer'
            },
            commandContainer: {
              id: 'commandContainer-{groupType}-DDL',
              className: 'col-8 col-md-6 commandContainer',
              title: {
                id: '{groupType}-title-DDL',
                className: 'fw-bold fs-3'
              },
              paragraph: {
                id: '{groupType}-command-{index}-DDL',
                className: 'command'
              }
            },
            errorMessageContainer: {
              id: 'errorMessageContainer-DDL',
              className: 'col-2 col-md-3 errorMessageContainer',
              errorMessage: {
                className: 'error-message'
              }
            }
          }
        },
        downloadButtonContainer: {
          id: 'downloadButtonContainer-DDL',
          className: 'container',
          downloadButton: {
            className: 'downloadButton',
            textContent: 'Download as XML'
          }
        }
      } as IElementConifg
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
      ErrorType.CONTENT_NOT_FOUND_ERROR, 'ContentNotFoundError: Group "{groupType}" is not defind. 請檢查 SQL 檔案是否有包含該類別的指令。'
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
  elementConfigMap: Map<CommandType, IElementConifg>
  errorMessageMap: Map<ErrorType, string>
}

export interface IGroupSetting {
  title: string
  indicator: string
  searchEndPattern: string[]
}

export interface IHTMLElementConfig {
  id: string
  className: string
  innerText?: string
  textContent?: string
}

export interface IElementConifg {
  allGroupContainer: IAllGroupContainerConfig
  downloadButtonContainer: IDownloadButtonContainer
}

export interface IAllGroupContainerConfig extends IHTMLElementConfig {
  groupContainer: IGroupContainerConfig
}

export interface IGroupContainerConfig extends IHTMLElementConfig {
  warningMessageContainer: IWarningMessageContainer
  commandContainer: ICommandContainer
  errorMessageContainer: IErrorMessageContainer
}

export interface IDownloadButtonContainer extends IHTMLElementConfig {
  downloadButton: IHTMLElementConfig
}

export interface ICommandContainer extends IHTMLElementConfig {
  title: IHTMLElementConfig
  paragraph: IHTMLElementConfig
}

export interface IWarningMessageContainer extends IHTMLElementConfig {
  warningMessage: IHTMLElementConfig
}

export interface IErrorMessageContainer extends IHTMLElementConfig {
  errorMessage: IHTMLElementConfig
}

export enum GroupType {
  PreSQL = 'PreSQL',
  CountSQL = 'CountSQL',
  SelectSQL = 'SelectSQL',
  MainSQL = 'MainSQL',
  PostSQL = 'PostSQL'
}

export enum CommandType {
  DDL = 'DDL',
  DML = 'DML',
  NONE = 'NONE'
}

export enum ErrorType {
  CONTENT_NOT_FOUND_ERROR = 'CONTENT_NOT_FOUND_ERROR'
}