export const GROUP_SERACH = new Map<string, string[]>([
  [
    '--#PreSQL', ['--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
  ],
  [
    '--#CountSQL', ['--#SelectSQL', '--#MainSQL', '--#PostSQL']
  ],
  [
    '--#SelectSQL', ['--#MainSQL', '--#PostSQL']
  ],
  [
    '--#MainSQL', ['--#PostSQL']
  ],
  [
    '--#PostSQL', []
  ]
])

export const GROUP_TITLE = new Map<string, string>([
  [
    '--#PreSQL', '前置宣告'
  ],
  [
    '--#CountSQL', 'Count語法'
  ],
  [
    '--#SelectSQL', '異動前/後語法'
  ],
  [
    '--#MainSQL', '異動語法'
  ],
  [
    '--#PostSQL', '後置語法'
  ]
])

export const SINGLE_COMMAND_INDICATOR = '/*--!*/'