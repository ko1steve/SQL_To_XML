

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
        allGroupsContainer: {
          id: 'allGroupsContainer-DML',
          className: 'container',
          singleGroupContainerConfig: {
            className: 'groupContainer container',
            title: {
              id: '{groupType}-title-DML',
              className: 'fw-bold fs-3'
            },
            paragraph: {
              id: '{groupType}-command-{index}-DML',
              className: 'command'
            }
          } as ISingleGroupContainerConfig
        },
        downloadButtonContainer: {
          id: 'downloadButtonContainer-DML',
          className: 'container',
          downloadButton: {
            className: 'downloadButton',
            textContent: 'Download as XML'
          }
        } as IDownloadButtonContainer
      } as IElementConifg
    ],
    [
      CommandType.DDL, {
        allGroupsContainer: {
          id: 'allGroupsContainer-DDL',
          className: 'container',
          singleGroupContainerConfig: {
            className: 'groupContainer container',
            title: {
              id: '{groupType}-title-DDL',
              className: 'fw-bold fs-3'
            },
            paragraph: {
              id: '{groupType}-command-{index}-DDL',
              className: 'command'
            }
          } as ISingleGroupContainerConfig
        },
        downloadButtonContainer: {
          id: 'downloadButtonContainer-DDL',
          className: 'container',
          downloadButton: {
            className: 'downloadButton',
            textContent: 'Download as XML'
          }
        } as IDownloadButtonContainer
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

}

export interface IMainConfig {
  groupShowOrder: GroupType[]
  checkCommandGroup: Map<CommandType, GroupType[]>
  groupSettingMap: Map<GroupType, IGroupSetting>
  singleCommandIndicator: string
  ignoredCommands: string[]
  invalidCommands: string[]
  elementConfigMap: Map<CommandType, IElementConifg>
}

export interface IGroupSetting {
  title: string;
  indicator: string;
  searchEndPattern: string[];
}

export interface IHTMLElementConfig {
  id: string;
  className: string;
  innerText?: string;
  textContent?: string;
}

export interface IElementConifg {
  allGroupsContainer: IAllGroupsContainerConfig
  downloadButtonContainer: IDownloadButtonContainer
}

export interface IAllGroupsContainerConfig extends IHTMLElementConfig {
  singleGroupContainerConfig: ISingleGroupContainerConfig
}

export interface ISingleGroupContainerConfig extends IHTMLElementConfig {
  title: IHTMLElementConfig
  paragraph: IHTMLElementConfig
}

export interface IDownloadButtonContainer extends IHTMLElementConfig {
  downloadButton: IHTMLElementConfig
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