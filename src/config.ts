

export class MainConfig implements IMainConfig {

  public groupSettingMap: Map<GroupName, IGroupSetting> = new Map<GroupName, IGroupSetting>([
    [
      GroupName.PreSQL, {
        title: '前置宣告',
        indicator: '--#PreSQL',
        searchEndPattern: ['--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
      } as IGroupSetting
    ],
    [
      GroupName.CountSQL, {
        title: 'Count語法',
        indicator: '--#CountSQL',
        searchEndPattern: ['--#SelectSQL', '--#MainSQL', '--#PostSQL']
      } as IGroupSetting
    ],
    [
      GroupName.SelectSQL, {
        title: '異動前/後語法',
        indicator: '--#SelectSQL',
        searchEndPattern: ['--#MainSQL', '--#PostSQL']
      } as IGroupSetting
    ],
    [
      GroupName.MainSQL, {
        title: '異動語法',
        indicator: '--#MainSQL',
        searchEndPattern: ['--#PostSQL']
      } as IGroupSetting
    ],
    [
      GroupName.PostSQL, {
        title: '後置語法',
        indicator: '--#PostSQL',
        searchEndPattern: []
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
              id: '{groupName}-title-DML',
              className: 'fw-bold fs-3'
            },
            paragraph: {
              id: '{groupName}-command-{index}-DML',
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
              id: '{groupName}-title-DDL',
              className: 'fw-bold fs-3'
            },
            paragraph: {
              id: '{groupName}-command-{index}-DDL',
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

}

export interface IGroupSetting {
  title: string;
  indicator: string;
  searchEndPattern: string[];
}

export interface IMainConfig {
  groupSettingMap: Map<GroupName, IGroupSetting>;
  singleCommandIndicator: string
  ignoredCommands: string[]
  invalidCommands: string[]
  elementConfigMap: Map<CommandType, IElementConifg>
}

export enum CommandType {
  DDL = 'DDL',
  DML = 'DML',
  NONE = 'NONE'
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

export enum GroupName {
  PreSQL = 'PreSQL',
  CountSQL = 'CountSQL',
  SelectSQL = 'SelectSQL',
  MainSQL = 'MainSQL',
  PostSQL = 'PostSQL'
}