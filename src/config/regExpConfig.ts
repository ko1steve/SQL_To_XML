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
          'CREATE [OR REPLACE] PROCEDURE', /[\s\t]*CREATE\s+(OR\s+REPLACE\s+)?PROCEDURE/
        ],
        [
          'CREATE [OR REPLACE] TRIGGER', /[\s\t]*CREATE\s+(OR\s+REPLACE\s+)?TRIGGER/
        ],
        [
          'ALTER PROCEDURE', /[\s\t]*ALTER\s+PROCEDURE/
        ],
        [
          'DROP PROCEDURE', /[\s\t]*DROP\s+PROCEDURE/
        ],
        [
          'CREATE [OR REPLACE] FUNCTION', /[\s\t]*CREATE\s+(OR\s+REPLACE\s+)?FUNCTION/
        ],
        [
          'CREATE [OR REPLACE] PACKAGE', /[\s\t]*CREATE\s+(OR\s+REPLACE\s+)?PACKAGE/
        ],
        [
          'CREATE [OR REPLACE] [FORCE] [EDITIONABLE] VIEW', /[\s\t]*CREATE\s+(OR\s+REPLACE\s+)?(FORCE\s+)?(EDITIONABLE\s+)?VIEW/
        ],
        [
          'TRUNCATE TABLE', /[\s\t]*TRUNCATE\s+TABLE/
        ],
        [
          'EXEC SYS.SP_ADDEXTENDEDPROPERTY', /[\s\t]*EXEC\s+SYS\.SP_ADDEXTENDEDPROPERTY\s+/
        ],
        [
          'COMMENT ON', /[\s\t]*COMMENT\s+ON/
        ],
        [
          'CREATE CONTEXT', /[\s\t]*CREATE\s+CONTEXT/
        ],
        [
          'CREATE DIRECTORY', /[\s\t]*CREATE\s+DIRECTORY/
        ],
        [
          'CREATE MATERIALIZED VIEW', /[\s\t]*CREATE\s+MATERIALIZED\s+VIEW/
        ],
        [
          'CREATE SEQUENCE', /[\s\t]*CREATE\s+SEQUENCE/
        ],
        [
          'CREATE SYNONYM', /[\s\t]*CREATE\s+SYNONYM/
        ],
        [
          'CREATE TRIGGER', /[\s\t]*CREATE\s+TRIGGER/
        ],
        [
          'CREATE TYPE', /[\s\t]*CREATE\s+TYPE/
        ],
        [
          'CREATE DATABASE LINK', /[\s\t]*CREATE\s+DATABASE\s+LINK/
        ],
        [
          'CREATE PUBLIC DATABASE LINK', /[\s\t]*CREATE\s+PUBLIC\s+DATABASE\s+LINK/
        ],
        [
          'CREATE PUBLIC SYNONYM', /[\s\t]*CREATE\s+PUBLIC\s+SYNONYM/
        ],
        [
          'ALTER MATERIALIZED VIEW', /[\s\t]*ALTER\s+MATERIALIZED\s+VIEW/
        ],
        [
          'ALTER SEQUENCE', /[\s\t]*ALTER\s+SEQUENCE/
        ],
        [
          'ALTER SYNONYM', /[\s\t]*ALTER\s+SYNONYM/
        ],
        [
          'ALTER TRIGGER', /[\s\t]*ALTER\s+TRIGGER/
        ],
        [
          'ALTER TYPE', /[\s\t]*ALTER\s+TYPE/
        ],
        [
          'ALTER DATABASE LINK', /[\s\t]*ALTER\s+DATABASE\s+LINK/
        ],
        [
          'DROP DIRECTORY', /[\s\t]*DROP\s+DIRECTORY/
        ],
        [
          'DROP MATERIALIZED VIEW', /[\s\t]*DROP\s+MATERIALIZED\s+VIEW/
        ],
        [
          'DROP SEQUENCE', /[\s\t]*DROP\s+SEQUENCE/
        ],
        [
          'DROP SYNONYM', /[\s\t]*DROP\s+SYNONYM/
        ],
        [
          'DROP TRIGGER', /[\s\t]*DROP\s+TRIGGER/
        ],
        [
          'DROP VIEW', /[\s\t]*DROP\s+VIEW/
        ],
        [
          'DROP PUBLIC DATABASE LINK', /[\s\t]*DROP\s+PUBLIC\s+DATABASE\s+LINK/
        ],
        [
          'DROP PUBLIC SYNONYM', /[\s\t]*DROP\s+PUBLIC\s+SYNONYM/
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
          'INSERT INTO', /^[\s\t]*INSERT\s+INTO\s+/
        ],
        [
          'UPDATE', /^[\s\t]*UPDATE\s+/
        ],
        [
          'DELETE', /^[\s\t]*DELETE\s+/
        ],
        [
          'SELECT INTO', /^[\s\t]*SELECT\s+.*\s+INTO/
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
          'SELECT', /^[\s\t]*SELECT\s+(?!.*\s+INTO\s+(#|##)[A-Za-z0-9]+)/
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
      //* 不允許 SELECT INTO 以外的 SELECT 語法、其他 DML 語法、DDL語法、GRANT語法、REVOKE語法
      GroupType.PreProdSQL, new TSMap<string, RegExp>([
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
          'SELECT', /^[\s\t]*SELECT\s+(?!.*\s+INTO\s+(#|##)[A-Za-z0-9]+)/
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
          'SELECT', /^[\s\t]*SELECT\s+(?!.*\s+INTO\s+(#|##)[A-Za-z0-9]+)/
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
      //* 不允許 SELECT INTO 以外的 SELECT 語法、其他 DML 語法、DDL語法、GRANT語法、REVOKE語法
      GroupType.PreProdSQL, new TSMap<string, RegExp>([
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
          'SELECT', /^[\s\t]*SELECT\s+(?!.*\s+INTO\s+(#|##)[A-Za-z0-9]+)/
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
