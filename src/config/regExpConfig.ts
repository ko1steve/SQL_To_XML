import { StringBuilder } from 'src/config/commandData'
import { GroupType } from 'src/mainConfig'
import { Singleton } from 'typescript-ioc'
import { TSMap } from 'typescript-map'

@Singleton
export class RegExpConfig {
  public static readonly ALL_MSSQL_DDL_VALID_REGEXP: RegExp = /^(?:(?:(?:CREATE|ALTER)\s+(?:TABLE|VIEW|INDEX\s+\S+\s+ON|PROCEDURE|FUNCTION|TRIGGER|SEQUENCE)\s+(?!@|#|##))|CREATE\s+OR\s+ALTER\s+(?:PROCEDURE|FUNCTION|TRIGGER)\s+(?!@|#|##)|CREATE\s+(?:SYNONYM|UNIQUE\s+INDEX\s+\S+\s+ON)\s+(?!@|#|##)|DROP\s+(?:PROCEDURE|FUNCTION|TRIGGER|TABLE|VIEW|INDEX|SYNONYM|SEQUENCE)\s+(?:IF\s+EXISTS\s+)?(?!@|#|##)|TRUNCATE\s+TABLE\s+(?!@|#|##)|EXEC\s+(?:(?:sys\.)?sp_addextendedproperty|(?:\S+\.\S+\.)?sp_addlinkedserver|(?:\S+\.\S+\.)?sp_serveroption)\s+).+$/gmi
  public static readonly ALL_ORACLE_DDL_VALID_REGEXP: RegExp = /^(?:(?:CREATE\s+(?:(?:TABLE|VIEW|PROCEDURE|FUNCTION|TRIGGER|PACKAGE|PACKAGE\s+BODY|MATERIALIZED\s+VIEW(?:\s+LOG\s+ON)?|(?:PUBLIC\s+)?SYNONYM|TYPE(?:\s+BODY)?|SEQUENCE|(?:UNIQUE\s+)?INDEX\s+\S+\.\S+\s+ON)\s+(?:IF\s+NOT\s+EXISTS\s+)?\S+\.|(?:CONTEXT|DIRECTORY|(?:(?:PUBLIC\s+)?DATABASE\s+LINK))\s+(?:IF\s+NOT\s+EXISTS\s+)?)(?!@|#|##))|ALTER\s+(?:(?:TABLE|VIEW|INDEX|PROCEDURE|FUNCTION|TRIGGER|PACKAGE|MATERIALIZED\s+VIEW(?:\s+LOG\s+ON)?|(?:PUBLIC\s+)?SYNONYM|TYPE(?:\s+BODY)?|SEQUENCE)\s+(?:IF\s+EXISTS\s+)?\S+\.|(?:(?:PUBLIC\s+)?DATABASE\s+LINK\s+(?:IF\s+EXISTS\s+)?))|CREATE\s+OR\s+REPLACE\s+(?:(?:(?:FORCE\s+EDITIONABLE\s+)?VIEW|PROCEDURE|FUNCTION|TRIGGER|PACKAGE(?:\s+BODY)?|(?:PUBLIC\s+)?SYNONYM|TYPE(?:\s+BODY)?)\s+(?:IF\s+NOT\s+EXISTS\s+)?(?!@|#|##)\S+\.|(?:CONTEXT|DIRECTORY)\s(?:IF\s+NOT\s+EXISTS\s+)?(?!@|#|##))|DROP\s+(?:(?:TABLE|VIEW|INDEX|PROCEDURE|FUNCTION|TRIGGER|PACKAGE|PACKAGE\s+BODY|MATERIALIZED\s+VIEW(?:\s+LOG\s+ON)?|(?:PUBLIC\s+)?SYNONYM|TYPE(?:\s+BODY)?|SEQUENCE|PACKAGE\s+BODY)\s+(?:IF\s+EXISTS\s+)?(?!@|#|##)\S+\.|(?:CONTEXT|DIRECTORY|(?:PUBLIC\s+)?DATABASE\s+LINK)\s+(?:IF\s+EXISTS\s+)?(?!@|#|##))|TRUNCATE\s+TABLE\s+(?!@|#|##)\S+\.|COMMENT\s+ON\s+(?:TABLE|COLUMN)\s+(?!@|#|##)\S+\.).+$/gmi

  public static readonly ALL_DDL_VALID_REGEXP: RegExp = RegExpConfig.combineRegExps([
    RegExpConfig.ALL_MSSQL_DDL_VALID_REGEXP, RegExpConfig.ALL_ORACLE_DDL_VALID_REGEXP
  ])

  public static readonly ALL_DDL_VALID_REGEXP_WITHOUT_CHECK_TEMP_TABLE = new RegExp(
    RegExpConfig.ALL_DDL_VALID_REGEXP.source.replaceAll('(?!@|#|##)', ''), 'gmi'
  )

  public static readonly ALL_MSSQL_DML_VALID_REGEXP: RegExp = /^(?:insert\s+into\s+(?!@|#|##)|select\s+(?:\52|.+)\s+into\s+(?!@|#|##).+\s+from\s+|update\s+\S+\s+set\s+|delete\s+).+$/gmi
  public static readonly ALL_ORACLE_DML_VALID_REGEXP: RegExp = /^(?:insert\s+into\s+\S+\.\S+(?!@|#|##)|select\s+(?:\52|.+)\s+into\s+(?!@|#|##)\S+\.\S+\s+from\s+|update\s+\S+\.\S+\s+set\s+|delete\s+).+$/gmi

  public static readonly ALL_DML_VALID_REGEXP: RegExp = RegExpConfig.combineRegExps([
    RegExpConfig.ALL_MSSQL_DML_VALID_REGEXP, RegExpConfig.ALL_ORACLE_DML_VALID_REGEXP
  ])

  public static readonly ALL_DML_VALID_REGEXP_WITHOUT_CHECK_TEMP_TABLE = new RegExp(
    RegExpConfig.ALL_DML_VALID_REGEXP.source.replaceAll('(?!@|#|##)', ''), 'gmi'
  )

  public static readonly MSSQL_SELECT_VALID_REGEXP: RegExp = /^SELECT\s+(?!COUNT\((?:[0-9]+|\*)\)\s+|.+\s+INTO\s+)(?:.+|\*)\s+FROM\s+\S+.+$/gmi
  public static readonly ORACLE_SELECT_VALID_REGEXP: RegExp = /^SELECT\s+(?!COUNT\((?:[0-9]+|\*)\)\s+|.+\s+INTO\s+)(?:.+|\*)\s+FROM\s+\S+\.+\S+.+$/gmi

  public static readonly SELECT_VALID_REGEXP: RegExp = RegExpConfig.combineRegExps([
    RegExpConfig.MSSQL_SELECT_VALID_REGEXP, RegExpConfig.ORACLE_SELECT_VALID_REGEXP
  ])

  public static readonly MSSQL_SELECT_COUNT_REGEXP: RegExp = /^(?:Select\s+count\([*|1]\)\s+From\s+\S+).+$/gmi
  public static readonly ORACLE_SELECT_COUNT_REGEXP: RegExp = /^(?:Select\s+count\([*|1]\)\s+From\s+\S+\.\S+).+$/gmi

  public static readonly SELECT_COUNT_REGEXP: RegExp = RegExpConfig.combineRegExps([
    RegExpConfig.MSSQL_SELECT_COUNT_REGEXP, RegExpConfig.ORACLE_SELECT_COUNT_REGEXP
  ])

  public static readonly GRANT_REVOKE_REGEXP: RegExp = /^(?:grant\s+.\S.+to\s+|revoke\s+\S.+from\s+)\S.+$/gmi

  public static readonly ANY_COMMAND_REGEXP: RegExp = /^.+$/gmi

  public static readonly INSERT_INTO_REGEXP: RegExp = /^(?:insert\s+into\s+(?:@|#|##)\S+\s+Select).+$/gmi

  public static readonly ALL_VALID_REGEXP: RegExp = RegExpConfig.combineRegExps([
    RegExpConfig.ALL_DDL_VALID_REGEXP, RegExpConfig.ALL_DML_VALID_REGEXP, RegExpConfig.SELECT_VALID_REGEXP, RegExpConfig.SELECT_COUNT_REGEXP
  ])

  public static combineRegExps (regExps: RegExp[], flags: string = 'gmi') {
    const stringBuilder = new StringBuilder()
    regExps.forEach(e => stringBuilder.append(e.source))
    const regSource = '(?:' + stringBuilder.toString('|') + ')'
    return new RegExp(regSource, flags)
  }
}

export interface IRegExpMapConfig {
  validRegExpMapDDL: TSMap<GroupType, TSMap<string, RegExp>>
  validRegExpMapDML: TSMap<GroupType, TSMap<string, RegExp>>
  invalidRegExpMapDDL: TSMap<GroupType, TSMap<string, RegExp>>
  invalidRegExpMapDML: TSMap<GroupType, TSMap<string, RegExp>>
}

export class RegExpMapConfig implements IRegExpMapConfig {
  public validRegExpMapDDL = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      GroupType.PreProdSQL, new TSMap<string, RegExp>([
        [
          Command.DDL, RegExpConfig.ALL_DDL_VALID_REGEXP
        ]
      ])
    ],
    [
      //* 指定「Select count(1)」或「Select count(*)」
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          Command.SELECT_COUNT, RegExpConfig.SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」(但不能是 Select Count 和 Select Into)
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          Command.SELECT, RegExpConfig.SELECT_VALID_REGEXP
        ]
      ])
    ],
    [
      //* 指定每種 DDL 語法
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          Command.DDL, RegExpConfig.ALL_DDL_VALID_REGEXP
        ]
      ])
    ]
  ])

  public validRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 指定「Select count(1)」或「Select count(*)」
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          Command.SELECT_COUNT, RegExpConfig.SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          Command.SELECT, RegExpConfig.SELECT_VALID_REGEXP
        ]
      ])
    ],
    [
      //* 指定「Insert into」、「Update set」、「Delete」、「Select into」
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          Command.DML, RegExpConfig.ALL_DML_VALID_REGEXP
        ]
      ])
    ]
  ])

  public invalidRegExpMapDDL = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      GroupType.PreSQL, new TSMap<string, RegExp>([
        [
          Command.DDL, RegExpConfig.ALL_DDL_VALID_REGEXP
        ],
        [
          Command.DML, RegExpConfig.ALL_DML_VALID_REGEXP
        ],
        [
          Command.SELECT, RegExpConfig.SELECT_VALID_REGEXP
        ],
        [
          Command.SELECT_COUNT, RegExpConfig.SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        [
          Command.DDL, RegExpConfig.ALL_DDL_VALID_REGEXP
        ],
        [
          Command.DML, RegExpConfig.ALL_DML_VALID_REGEXP
        ],
        [
          Command.SELECT, RegExpConfig.SELECT_VALID_REGEXP
        ],
        [
          Command.SELECT_COUNT, RegExpConfig.SELECT_COUNT_REGEXP
        ]
      ])
    ]
  ])

  public invalidRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      GroupType.PreSQL, new TSMap<string, RegExp>([
        [
          Command.DDL, RegExpConfig.ALL_DDL_VALID_REGEXP
        ],
        [
          Command.DML, RegExpConfig.ALL_DML_VALID_REGEXP
        ],
        [
          Command.SELECT, RegExpConfig.SELECT_VALID_REGEXP
        ],
        [
          Command.SELECT_COUNT, RegExpConfig.SELECT_COUNT_REGEXP
        ]
      ])
    ],
    [
      GroupType.PreProdSQL, new TSMap<string, RegExp>([
        [
          Command.ANY_COMMAND, RegExpConfig.ANY_COMMAND_REGEXP
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        [
          Command.DDL, RegExpConfig.ALL_DDL_VALID_REGEXP
        ],
        [
          Command.DML, RegExpConfig.ALL_DML_VALID_REGEXP
        ],
        [
          Command.SELECT, RegExpConfig.SELECT_VALID_REGEXP
        ],
        [
          Command.SELECT_COUNT, RegExpConfig.SELECT_COUNT_REGEXP
        ]
      ])
    ]
  ])
}

export enum Command {
  SELECT = 'SELECT',
  SELECT_COUNT = 'SELECT COUNT',
  DDL = 'DDL',
  DML = 'DML',
  ANY_COMMAND = 'ANY COMMAND'
}
