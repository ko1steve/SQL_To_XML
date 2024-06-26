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
          'SELECT COUNT', /^\s*^(?:Select\s+count\([*|1]\)\s+From\s+[A-Za-z]+\.[A-Za-z]+)$/
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'SELECT', /^\s*Select\s+(?:\*|.*)\s+From\s+/
        ]
      ])
    ],
    [
      //* 指定每種 DDL 語法
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          'CREATE TABLE', /\s*CREATE\s+TABLE\s+/
        ],
        [
          'ALTER TABLE', /\s*ALTER\s+TABLE\s+/
        ],
        [
          'DROP TABLE', /\s*DROP\s+TABLE\s+/
        ],
        [
          'CREATE INDEX', /\s*CREATE\s+INDEX\s+/
        ],
        [
          'ALTER INDEX', /\s*ALTER\s+INDEX\s+/
        ],
        [
          'DROP INDEX', /\s*DROP\s+INDEX\s+/
        ],
        [
          'CREATE [OR REPLACE] PROCEDURE', /\s*CREATE\s+(?:OR\s+REPLACE)?\s+PROCEDURE\s+/
        ],
        [
          'ALTER PROCEDURE', /\s*ALTER\s+PROCEDURE\s+/
        ],
        [
          'DROP PROCEDURE', /\s*DROP\s+PROCEDURE\s+/
        ],
        [
          'CREATE [OR REPLACE] FUNCTION', /\s*CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+/
        ],
        [
          'CREATE [OR REPLACE] PACKAGE', /\s*CREATE\s+(?:OR\s+REPLACE\s+)?PACKAGE\s+/
        ],
        [
          'CREATE [OR REPLACE] [FORCE] [EDITIONABLE] VIEW', /\s*CREATE\s+(?:OR\s+REPLACE\s+)?(?:FORCE\s+)?(?:EDITIONABLE\s+)?VIEW\s+/
        ],
        [
          'TRUNCATE TABLE', /\s*TRUNCATE\s+TABLE\s+/
        ],
        [
          'COMMENT ON', /\s*COMMENT\s+ON\s+/
        ],
        [
          'CREATE CONTEXT', /\s*CREATE\s+CONTEXT\s+/
        ],
        [
          'CREATE DIRECTORY', /\s*CREATE\s+DIRECTORY\s+/
        ],
        [
          'CREATE MATERIALIZED VIEW', /\s*CREATE\s+MATERIALIZED\s+VIEW\s+/
        ],
        [
          'CREATE SEQUENCE', /\s*CREATE\s+SEQUENCE\s+/
        ],
        [
          'CREATE SYNONYM', /\s*CREATE\s+SYNONYM\s+/
        ],
        [
          'CREATE TRIGGER', /\s*CREATE\s+TRIGGER\s+/
        ],
        [
          'CREATE TYPE', /\s*CREATE\s+TYPE\s+/
        ],
        [
          'CREATE DATABASE LINK', /\s*CREATE\s+DATABASE\s+LINK\s+/
        ],
        [
          'CREATE PUBLIC DATABASE LINK', /\s*CREATE\s+PUBLIC\s+DATABASE\s+LINK\s+/
        ],
        [
          'CREATE PUBLIC SYNONYM', /\s*CREATE\s+PUBLIC\s+SYNONYM\s+/
        ],
        [
          'ALTER MATERIALIZED VIEW', /\s*ALTER\s+MATERIALIZED\s+VIEW\s+/
        ],
        [
          'ALTER SEQUENCE', /\s*ALTER\s+SEQUENCE\s+/
        ],
        [
          'ALTER SYNONYM', /\s*ALTER\s+SYNONYM\s+/
        ],
        [
          'ALTER TRIGGER', /\s*ALTER\s+TRIGGER\s+/
        ],
        [
          'ALTER TYPE', /\s*ALTER\s+TYPE\s+/
        ],
        [
          'ALTER DATABASE LINK', /\s*ALTER\s+DATABASE\s+LINK\s+/
        ],
        [
          'DROP DIRECTORY', /\s*DROP\s+DIRECTORY\s+/
        ],
        [
          'DROP MATERIALIZED VIEW', /\s*DROP\s+MATERIALIZED\s+VIEW\s+/
        ],
        [
          'DROP SEQUENCE', /\s*DROP\s+SEQUENCE\s+/
        ],
        [
          'DROP SYNONYM', /\s*DROP\s+SYNONYM\s+/
        ],
        [
          'DROP TRIGGER', /\s*DROP\s+TRIGGER\s+/
        ],
        [
          'DROP VIEW', /\s*DROP\s+VIEW\s+/
        ],
        [
          'DROP PUBLIC DATABASE LINK', /\s*DROP\s+PUBLIC\s+DATABASE\s+LINK\s+/
        ],
        [
          'DROP PUBLIC SYNONYM', /\s*DROP\s+PUBLIC\s+SYNONYM\s+/
        ]
      ])
    ]
  ])

  public validRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 指定「Select count(1)」或「Select count(*)」
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          'SELECT COUNT', /^\s*^(?:Select\s+count\([*|1]\)\s+From\s+[A-Za-z]+\.[A-Za-z]+)$/
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'SELECT', /^\s*Select\s+(?:\*|.*)\s+From\s+/
        ]
      ])
    ],
    [
      //* 指定「Insert into」、「Update set」、「Delete」、「Select into」
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          'INSERT INTO', /^\s*INSERT\s+.*\s+INTO\s+/
        ],
        [
          'UPDATE SET', /^\s*UPDATE\s+.*\s+SET\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'SELECT INTO', /^\s*SELECT\s+.*\s+INTO\s+/
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
          'UPDATE', /^\s*UPDATE\s+/
        ],
        [
          'DELETE', /^\s*DELETE\s+/
        ],
        [
          'INSERT', /^\s*INSERT\s+/
        ],
        [
          'SELECT', /^\s*SELECT(?!\s+INTO)\s+/
        ],
        //* DDL
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
        //* GRANT & REVOKE
        [
          'GRANT', /^\s*GRANT\s+/
        ],
        [
          'REVOKE', /^\s*REVOKE\s+/
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        //* DML
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
          'SELECT', /^\s*SELECT(?!\s+INTO)\s+/
        ],
        //* DDL
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
        //* GRANT & REVOKE
        [
          'GRANT', /^\s*GRANT\s+/
        ],
        [
          'REVOKE', /^\s*REVOKE\s+/
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
        //* DDL
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
        //* GRANT & REVOKE
        [
          'GRANT', /^\s*GRANT\s+/
        ],
        [
          'REVOKE', /^\s*REVOKE\s+/
        ]
      ])
    ],
    [
      GroupType.PostSQL, new TSMap<string, RegExp>([
        //* DML
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
        //* DDL
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
        //* GRANT & REVOKE
        [
          'GRANT', /^\s*GRANT\s+/
        ],
        [
          'REVOKE', /^\s*REVOKE\s+/
        ]
      ])
    ]
  ])
}
