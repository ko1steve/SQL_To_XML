import { StringBuilder } from 'src/config/CommandData'
import { GroupType } from 'src/mainConfig'
import { TSMap } from 'typescript-map'

export const ALL_DDL_VALID_REGEXP: RegExp = /^(?:(?:(?:CREATE|DROP|ALTER)\s+(?:TABLE|INDEX\s+\S+\s+ON|PROCEDURE|CONTEXT|MATERIALIZED\s+VIEW|SEQUENCE|SYNONYM|PUBLIC\s+SYNONYM|TRIGGER|DIRECTORY|VIEW|PUBLIC\s+DATABASE\s+LINK|TYPE|DATABASE\s+LINK)\s+(?:\S+\.\S+)?(?!(@|#|##)))|(?:CREATE\s+OR\s+(?:REPLACE|ALTER)\s+(?:PROCEDURE|FUNCTION|PACKAGE|VIEW)\s+(?:\S+\.\S+)?(?!(@|#|##)))|CREATE\s+OR\s+REPLACE.+VIEW\s+|TRUNCATE\s+TABLE\s+|EXEC\s+sys\.sp_addextendedproperty\s+@name=|COMMENT\s+ON\s+).+$/gmi
export const ALL_DML_VALID_REGEXP: RegExp = /^(?:insert\s+into\s+(\S+\.\S+)?(?!(@|#|##))|select\s+(?:\52?|\S+)\s+into\s+(?!(@|#|##))(\s+.+|\S+\.\S+.*)\s+from\s+|update\s+\S+(\.\S+)?\s+set\s+|delete\s+).+$/gmi
export const SELECT_VALID_REGEXP: RegExp = /^(?:Select\s+(?:(?!count\(([0-9]+|\*)\))(?!\s+).+|\*)\s+(?!Into\s+\S+\s+)From\s+(?:\S+\.\S+|\S+)).+$/gmi
export const SELECT_COUNT_REGEXP: RegExp = /^(?:Select\s+count\([*|1]\)\s+From\s+(?:\S+\.\S+|\S+)).+$/gmi

const getAllValidRegExp = (sources: RegExp[]) => {
  const stringBuilder = new StringBuilder()
  sources.forEach(e => stringBuilder.append(e.source))
  const regSource = '(?:' + stringBuilder.toString('|') + ')'
  return new RegExp(regSource, 'gmi')
}

export const ALL_VALID_REGEXP: RegExp = getAllValidRegExp([
  ALL_DDL_VALID_REGEXP, ALL_DML_VALID_REGEXP, SELECT_VALID_REGEXP, SELECT_COUNT_REGEXP
])

export interface IRegExpConfig {
  validRegExpMapDDL: TSMap<GroupType, TSMap<string, RegExp>>
  validRegExpMapDML: TSMap<GroupType, TSMap<string, RegExp>>
  invalidRegExpMapDDL: TSMap<GroupType, TSMap<string, RegExp>>
  invalidRegExpMapDML: TSMap<GroupType, TSMap<string, RegExp>>
}

export class RegExpConig implements IRegExpConfig {
  public validRegExpMapDDL = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 指定「Select count(1)」或「Select count(*)」
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          'SELECT COUNT', SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」(但不能是 Select Count 和 Select Into)
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'SELECT', SELECT_VALID_REGEXP
        ]
      ])
    ],
    [
      //* 指定每種 DDL 語法
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          'DDL', ALL_DDL_VALID_REGEXP
        ]
      ])
    ]
  ])

  public validRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 指定「Select count(1)」或「Select count(*)」
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          'SELECT COUNT', SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'SELECT', SELECT_VALID_REGEXP
        ]
      ])
    ],
    [
      //* 指定「Insert into」、「Update set」、「Delete」、「Select into」
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          'DML', ALL_DML_VALID_REGEXP
        ]
      ])
    ]
  ])

  public invalidRegExpMapDDL = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      GroupType.PreSQL, new TSMap<string, RegExp>([
        [
          'DDL', ALL_DDL_VALID_REGEXP
        ],
        [
          'DML', ALL_DML_VALID_REGEXP
        ],
        [
          'SELECT', SELECT_VALID_REGEXP
        ],
        [
          'SELECT COUNT', SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      GroupType.PreProdSQL, new TSMap<string, RegExp>([
        [
          'DDL', ALL_DDL_VALID_REGEXP
        ],
        [
          'DML', ALL_DML_VALID_REGEXP
        ],
        [
          'SELECT', SELECT_VALID_REGEXP
        ],
        [
          'SELECT COUNT', SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        [
          'DDL', ALL_DDL_VALID_REGEXP
        ],
        [
          'DML', ALL_DML_VALID_REGEXP
        ],
        [
          'SELECT', SELECT_VALID_REGEXP
        ],
        [
          'SELECT COUNT', SELECT_COUNT_REGEXP
        ]
      ])
    ]
  ])

  public invalidRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      GroupType.PreSQL, new TSMap<string, RegExp>([
        [
          'DDL', ALL_DDL_VALID_REGEXP
        ],
        [
          'DML', ALL_DML_VALID_REGEXP
        ],
        [
          'SELECT', SELECT_VALID_REGEXP
        ],
        [
          'SELECT COUNT', SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      GroupType.PreProdSQL, new TSMap<string, RegExp>([
        [
          'DDL', ALL_DDL_VALID_REGEXP
        ],
        [
          'DML', ALL_DML_VALID_REGEXP
        ],
        [
          'SELECT', SELECT_VALID_REGEXP
        ],
        [
          'SELECT COUNT', SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        [
          'DDL', ALL_DDL_VALID_REGEXP
        ],
        [
          'DML', ALL_DML_VALID_REGEXP
        ],
        [
          'SELECT', SELECT_VALID_REGEXP
        ],
        [
          'SELECT COUNT', SELECT_COUNT_REGEXP
        ]
      ])
    ]
  ])
}
