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
    [
      //* 指定「Select count(1)」或「Select count(*)」
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          'SELECT COUNT', /^[\s\t]*SELECT\s+COUNT\([\s\t]*[*|1][\s\t]*\)/
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'SELECT', /^[\s\t]*SELECT\s+(\*|.*)?/
        ]
      ])
    ],
    [
      //* 指定每種 DDL 語法
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          'CREATE TABLE', /[\s\t]*CREATE\s+TABLE\s+/
        ],
        [
          'ALTER TABLE', /[\s\t]*ALTER\s+TABLE\s+/
        ],
        [
          'DROP TABLE', /[\s\t]*DROP\s+TABLE\s+/
        ],
        [
          'CREATE INDEX', /[\s\t]*CREATE\s+INDEX\s+/
        ],
        [
          'ALTER INDEX', /[\s\t]*ALTER\s+INDEX\s+/
        ],
        [
          'DROP INDEX', /[\s\t]*DROP\s+INDEX\s+/
        ],
        [
          'CREATE [OR REPLACE] PROCEDURE', /[\s\t]*CREATE\s+(?:OR\s+REPLACE)?\s+PROCEDURE\s+/
        ],
        [
          'CREATE [OR REPLACE] TRIGGER', /[\s\t]*CREATE\s+(?:OR\s+REPLACE)?\s+TRIGGER\s+/
        ],
        [
          'ALTER PROCEDURE', /[\s\t]*ALTER\s+PROCEDURE\s+/
        ],
        [
          'DROP PROCEDURE', /[\s\t]*DROP\s+PROCEDURE\s+/
        ],
        [
          'CREATE [OR REPLACE] FUNCTION', /[\s\t]*CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+/
        ],
        [
          'CREATE [OR REPLACE] PACKAGE', /[\s\t]*CREATE\s+(?:OR\s+REPLACE\s+)?PACKAGE\s+/
        ],
        [
          'CREATE [OR REPLACE] [FORCE] [EDITIONABLE] VIEW', /[\s\t]*CREATE\s+(?:OR\s+REPLACE\s+)?(?:FORCE\s+)?(?:EDITIONABLE\s+)?VIEW\s+/
        ],
        [
          'TRUNCATE TABLE', /[\s\t]*TRUNCATE\s+TABLE\s+/
        ],
        [
          'COMMENT ON', /[\s\t]*COMMENT\s+ON\s+/
        ],
        [
          'CREATE CONTEXT', /[\s\t]*CREATE\s+CONTEXT\s+/
        ],
        [
          'CREATE DIRECTORY', /[\s\t]*CREATE\s+DIRECTORY\s+/
        ],
        [
          'CREATE MATERIALIZED VIEW', /[\s\t]*CREATE\s+MATERIALIZED\s+VIEW\s+/
        ],
        [
          'CREATE SEQUENCE', /[\s\t]*CREATE\s+SEQUENCE\s+/
        ],
        [
          'CREATE SYNONYM', /[\s\t]*CREATE\s+SYNONYM\s+/
        ],
        [
          'CREATE TRIGGER', /[\s\t]*CREATE\s+TRIGGER\s+/
        ],
        [
          'CREATE TYPE', /[\s\t]*CREATE\s+TYPE\s+/
        ],
        [
          'CREATE DATABASE LINK', /[\s\t]*CREATE\s+DATABASE\s+LINK\s+/
        ],
        [
          'CREATE PUBLIC DATABASE LINK', /[\s\t]*CREATE\s+PUBLIC\s+DATABASE\s+LINK\s+/
        ],
        [
          'CREATE PUBLIC SYNONYM', /[\s\t]*CREATE\s+PUBLIC\s+SYNONYM\s+/
        ],
        [
          'ALTER MATERIALIZED VIEW', /[\s\t]*ALTER\s+MATERIALIZED\s+VIEW\s+/
        ],
        [
          'ALTER SEQUENCE', /[\s\t]*ALTER\s+SEQUENCE\s+/
        ],
        [
          'ALTER SYNONYM', /[\s\t]*ALTER\s+SYNONYM\s+/
        ],
        [
          'ALTER TRIGGER', /[\s\t]*ALTER\s+TRIGGER\s+/
        ],
        [
          'ALTER TYPE', /[\s\t]*ALTER\s+TYPE\s+/
        ],
        [
          'ALTER DATABASE LINK', /[\s\t]*ALTER\s+DATABASE\s+LINK\s+/
        ],
        [
          'DROP DIRECTORY', /[\s\t]*DROP\s+DIRECTORY\s+/
        ],
        [
          'DROP MATERIALIZED VIEW', /[\s\t]*DROP\s+MATERIALIZED\s+VIEW\s+/
        ],
        [
          'DROP SEQUENCE', /[\s\t]*DROP\s+SEQUENCE\s+/
        ],
        [
          'DROP SYNONYM', /[\s\t]*DROP\s+SYNONYM\s+/
        ],
        [
          'DROP TRIGGER', /[\s\t]*DROP\s+TRIGGER\s+/
        ],
        [
          'DROP VIEW', /[\s\t]*DROP\s+VIEW\s+/
        ],
        [
          'DROP PUBLIC DATABASE LINK', /[\s\t]*DROP\s+PUBLIC\s+DATABASE\s+LINK\s+/
        ],
        [
          'DROP PUBLIC SYNONYM', /[\s\t]*DROP\s+PUBLIC\s+SYNONYM\s+/
        ]
      ])
    ]
  ])

  public validRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 指定「Select count(1)」或「Select count(*)」
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          'SELECT COUNT', /^[\s\t]*SELECT\s+COUNT\([\s\t]*[*|1][\s\t]*\)/
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'SELECT', /^[\s\t]*SELECT\s+/
        ]
      ])
    ],
    [
      //* 指定「Insert into」、「Update set」、「Delete」、「Select into」
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          'INSERT INTO', /^[\s\t]*INSERT\s+.*\s+INTO\s+/
        ],
        [
          'UPDATE SET', /^[\s\t]*UPDATE\s+.*\s+SET\s+/
        ],
        [
          'DELETE', /^[\s\t]*DELETE\s+/
        ],
        [
          'SELECT INTO', /^[\s\t]*SELECT\s+.*\s+INTO\s+/
        ]
      ])
    ]
  ])

  public invalidRegExpMapDDL = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 不允許 SELECT INTO 以外的 SELECT 語法、其他 DML 語法、DDL語法、GRANT語法、REVOKE語法
      GroupType.PreSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE\s+/
        ],
        [
          'DELETE', /^[\s\t]*DELETE\s+/
        ],
        [
          'INSERT', /^[\s\t]*INSERT\s+/
        ],
        [
          'SELECT', /^[\s\t]*SELECT(?!\s+INTO)\s+/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE\s+/
        ],
        [
          'ALTER', /^[\s\t]*ALTER\s+/
        ],
        [
          'DROP', /^[\s\t]*DROP\s+/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE\s+/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT\s+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE\s+/
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE\s+/
        ],
        [
          'DELETE', /^[\s\t]*DELETE\s+/
        ],
        [
          'INSERT', /^[\s\t]*INSERT\s+/
        ],
        [
          'SELECT', /^[\s\t]*SELECT(?!\s+INTO)\s+/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE\s+/
        ],
        [
          'ALTER', /^[\s\t]*ALTER\s+/
        ],
        [
          'DROP', /^[\s\t]*DROP\s+/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE\s+/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT\s+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE\s+/
        ]
      ])
    ]
  ])

  public invalidRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 不允許 SELECT INTO 以外的 SELECT 語法、其他 DML 語法、DDL語法、GRANT語法、REVOKE語法
      GroupType.PreSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE\s+/
        ],
        [
          'DELETE', /^[\s\t]*DELETE\s+/
        ],
        [
          'INSERT', /^[\s\t]*INSERT\s+/
        ],
        [
          'SELECT', /^[\s\t]*SELECT\s+/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE\s+/
        ],
        [
          'ALTER', /^[\s\t]*ALTER\s+/
        ],
        [
          'DROP', /^[\s\t]*DROP\s+/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE\s+/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT\s+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE\s+/
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE\s+/
        ],
        [
          'DELETE', /^[\s\t]*DELETE\s+/
        ],
        [
          'INSERT', /^[\s\t]*INSERT\s+/
        ],
        [
          'SELECT', /^[\s\t]*SELECT\s+/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE\s+/
        ],
        [
          'ALTER', /^[\s\t]*ALTER\s+/
        ],
        [
          'DROP', /^[\s\t]*DROP\s+/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE\s+/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT\s+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE\s+/
        ]
      ])
    ]
  ])
}
