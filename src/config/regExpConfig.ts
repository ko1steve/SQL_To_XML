import { GroupType } from 'src/mainConfig'
import { TSMap } from 'typescript-map'

export interface IRegExpConfig {
  validRegExpMapDDL: TSMap<GroupType, TSMap<string, RegExp>>
  validRegExpMapDML: TSMap<GroupType, TSMap<string, RegExp>>
  invalidRegExpMapDDL: TSMap<GroupType, TSMap<string, RegExp>>
  invalidRegExpMapDML: TSMap<GroupType, TSMap<string, RegExp>>
}

export class RegExpConig implements IRegExpConfig {
  public validRegExpMapDDL = new TSMap<GroupType, TSMap<string, RegExp>>([

  ])

  public validRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([

  ])

  public invalidRegExpMapDDL = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      GroupType.PreSQL, new TSMap<string, RegExp>([
        [
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        [
          'SELECT', /^\s*SELECT\s+/
        ],
        // [
        //   'CREATE', /^\s*CREATE\s+/
        // ],
        [
          'ALTER', /^\s*ALTER\s+/
        ],
        [
          'DROP', /^\s*DROP\s+/
        ],
        [
          'TRUNCATE', /^\s*TRUNCATE\s+/
        ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ],
    [
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        // [
        //   'SELECT', /^\s*SELECT\s+/
        // ],
        [
          'CREATE', /^\s*CREATE\s+/
        ],
        [
          'ALTER', /^\s*ALTER\s+/
        ],
        [
          'DROP', /^\s*DROP\s+/
        ],
        [
          'TRUNCATE', /^\s*TRUNCATE\s+/
        ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ],
    [
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        // [
        //   'SELECT', /^\s*SELECT\s+/
        // ],
        [
          'CREATE', /^\s*CREATE\s+/
        ],
        [
          'ALTER', /^\s*ALTER\s+/
        ],
        [
          'DROP', /^\s*DROP\s+/
        ],
        [
          'TRUNCATE', /^\s*TRUNCATE\s+/
        ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ],
    [
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        [
          'SELECT', /^\s*SELECT\s+/
        ],
        // [
        //   'CREATE', /^\s*CREATE\s+/
        // ],
        // [
        //   'ALTER', /^\s*ALTER\s+/
        // ],
        // [
        //   'DROP', /^\s*DROP\s+/
        // ],
        // [
        //   'TRUNCATE', /^\s*TRUNCATE\s+/
        // ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        [
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        [
          'SELECT', /^\s*SELECT\s+/
        ],
        [
          'CREATE', /^\s*CREATE\s+/
        ],
        [
          'ALTER', /^\s*ALTER\s+/
        ],
        // [
        //   'DROP', /^\s*DROP\s+/
        // ],
        [
          'TRUNCATE', /^\s*TRUNCATE\s+/
        ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ]
  ])

  public invalidRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      GroupType.PreSQL, new TSMap<string, RegExp>([
        [
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        [
          'SELECT', /^\s*SELECT\s+/
        ],
        // [
        //   'CREATE', /^\s*CREATE\s+/
        // ],
        [
          'ALTER', /^\s*ALTER\s+/
        ],
        [
          'DROP', /^\s*DROP\s+/
        ],
        [
          'TRUNCATE', /^\s*TRUNCATE\s+/
        ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ],
    [
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        // [
        //   'SELECT', /^\s*SELECT\s+/
        // ],
        [
          'CREATE', /^\s*CREATE\s+/
        ],
        [
          'ALTER', /^\s*ALTER\s+/
        ],
        [
          'DROP', /^\s*DROP\s+/
        ],
        [
          'TRUNCATE', /^\s*TRUNCATE\s+/
        ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ],
    [
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        // [
        //   'SELECT', /^\s*SELECT\s+/
        // ],
        [
          'CREATE', /^\s*CREATE\s+/
        ],
        [
          'ALTER', /^\s*ALTER\s+/
        ],
        [
          'DROP', /^\s*DROP\s+/
        ],
        [
          'TRUNCATE', /^\s*TRUNCATE\s+/
        ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ],
    [
      GroupType.MainSQL, new TSMap<string, RegExp>([
        // [
        //   'UPDATE', /^\s*UPDATE\s+/
        // ],
        // [
        //   'DELETE', /^\s*DELETE\s+/
        // ],
        // [
        //   'INSERT', /^\s*INSERT\s+/
        // ],
        // [
        //   'SELECT', /^\s*SELECT\s+/
        // ]
        [
          'CREATE', /^\s*CREATE\s+/
        ],
        [
          'ALTER', /^\s*ALTER\s+/
        ],
        [
          'DROP', /^\s*DROP\s+/
        ],
        [
          'TRUNCATE', /^\s*TRUNCATE\s+/
        ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        [
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        [
          'SELECT', /^\s*SELECT\s+/
        ],
        [
          'CREATE', /^\s*CREATE\s+/
        ],
        [
          'ALTER', /^\s*ALTER\s+/
        ],
        // [
        //   'DROP', /^\s*DROP\s+/
        // ],
        [
          'TRUNCATE', /^\s*TRUNCATE\s+/
        ],
        [
          'COMMIT', /^\s*COMMIT\s+/
        ]
      ])
    ]
  ])
}
