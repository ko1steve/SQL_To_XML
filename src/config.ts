export class MainConfig implements IMainConfig {

  public groupIndicators: Map<GroupName, string> = new Map<GroupName, string>([
    [
      GroupName.PreSQL, '--#PreSQL'
    ],
    [
      GroupName.CountSQL, '--#CountSQL'
    ],
    [
      GroupName.SelectSQL, '--#SelectSQL'
    ],
    [
      GroupName.MainSQL, '--#MainSQL'
    ],
    [
      GroupName.PostSQL, '--#PostSQL'
    ]
  ])

  public groupTitles: Map<GroupName, string> = new Map<GroupName, string>([
    [
      GroupName.PreSQL, '前置宣告'
    ],
    [
      GroupName.CountSQL, 'Count語法'
    ],
    [
      GroupName.SelectSQL, '異動前/後語法'
    ],
    [
      GroupName.MainSQL, '異動語法'
    ],
    [
      GroupName.PostSQL, '後置語法'
    ]
  ])

  public groupSearch: Map<GroupName, string[]> = new Map<GroupName, string[]>([
    [
      GroupName.PreSQL, ['--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
    ],
    [
      GroupName.CountSQL, ['--#SelectSQL', '--#MainSQL', '--#PostSQL']
    ],
    [
      GroupName.SelectSQL, ['--#MainSQL', '--#PostSQL']
    ],
    [
      GroupName.MainSQL, ['--#PostSQL']
    ],
    [
      GroupName.PostSQL, []
    ]
  ])

  public singleCommandIndicator: string = '/*--!*/'

  public ignoredCommands: string[] = ['GO']

  public invalidCommands: string[] = ['COMMIT']

}

export interface IMainConfig {
  groupIndicators: Map<GroupName, string>;
  groupTitles: Map<GroupName, string>
  groupSearch: Map<GroupName, string[]>
  singleCommandIndicator: string
  ignoredCommands: string[]
  invalidCommands: string[]
}

export enum GroupName {
  PreSQL = 'PreSQL',
  CountSQL = 'CountSQL',
  SelectSQL = 'SelectSQL',
  MainSQL = 'MainSQL',
  PostSQL = 'PostSQL'
}