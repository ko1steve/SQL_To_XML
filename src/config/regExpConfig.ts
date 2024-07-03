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
          'SELECT COUNT', /^[\s\t]*SELECT[\s\t]+COUNT\([\s\t]*[*|1][\s\t]*\)/
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'SELECT', /^[\s\t]*SELECT[\s\t]+(\*|.*)?/
        ]
      ])
    ],
    [
      //* 指定每種 DDL 語法
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          'CREATE TABLE', /[\s\t]*CREATE[\s\t]+TABLE[\s\t]+/
        ],
        [
          'ALTER TABLE', /[\s\t]*ALTER[\s\t]+TABLE[\s\t]+/
        ],
        [
          'DROP TABLE', /[\s\t]*DROP[\s\t]+TABLE[\s\t]+/
        ],
        [
          'CREATE INDEX', /[\s\t]*CREATE[\s\t]+INDEX[\s\t]+/
        ],
        [
          'ALTER INDEX', /[\s\t]*ALTER[\s\t]+INDEX[\s\t]+/
        ],
        [
          'DROP INDEX', /[\s\t]*DROP[\s\t]+INDEX[\s\t]+/
        ],
        [
          'CREATE [OR REPLACE] PROCEDURE', /[\s\t]*CREATE[\s\t]+(OR[\s\t]+REPLACE[\s\t]+)?PROCEDURE/
        ],
        [
          'CREATE [OR REPLACE] TRIGGER', /[\s\t]*CREATE[\s\t]+(OR[\s\t]+REPLACE[\s\t]+)?TRIGGER/
        ],
        [
          'ALTER PROCEDURE', /[\s\t]*ALTER[\s\t]+PROCEDURE/
        ],
        [
          'DROP PROCEDURE', /[\s\t]*DROP[\s\t]+PROCEDURE/
        ],
        [
          'CREATE [OR REPLACE] FUNCTION', /[\s\t]*CREATE[\s\t]+(OR[\s\t]+REPLACE[\s\t]+)?FUNCTION/
        ],
        [
          'CREATE [OR REPLACE] PACKAGE', /[\s\t]*CREATE[\s\t]+(OR[\s\t]+REPLACE[\s\t]+)?PACKAGE/
        ],
        [
          'CREATE [OR REPLACE] [FORCE] [EDITIONABLE] VIEW', /[\s\t]*CREATE[\s\t]+(OR[\s\t]+REPLACE[\s\t]+)?(FORCE[\s\t]+)?(EDITIONABLE[\s\t]+)?VIEW/
        ],
        [
          'TRUNCATE TABLE', /[\s\t]*TRUNCATE[\s\t]+TABLE/
        ],
        [
          'EXEC SYS.SP_ADDEXTENDEDPROPERTY', /[\s\t]*EXEC[\s\t]+SYS\.SP_ADDEXTENDEDPROPERTY[\s\t]+/
        ],
        [
          'COMMENT ON', /[\s\t]*COMMENT[\s\t]+ON/
        ],
        [
          'CREATE CONTEXT', /[\s\t]*CREATE[\s\t]+CONTEXT/
        ],
        [
          'CREATE DIRECTORY', /[\s\t]*CREATE[\s\t]+DIRECTORY/
        ],
        [
          'CREATE MATERIALIZED VIEW', /[\s\t]*CREATE[\s\t]+MATERIALIZED[\s\t]+VIEW/
        ],
        [
          'CREATE SEQUENCE', /[\s\t]*CREATE[\s\t]+SEQUENCE/
        ],
        [
          'CREATE SYNONYM', /[\s\t]*CREATE[\s\t]+SYNONYM/
        ],
        [
          'CREATE TRIGGER', /[\s\t]*CREATE[\s\t]+TRIGGER/
        ],
        [
          'CREATE TYPE', /[\s\t]*CREATE[\s\t]+TYPE/
        ],
        [
          'CREATE DATABASE LINK', /[\s\t]*CREATE[\s\t]+DATABASE[\s\t]+LINK/
        ],
        [
          'CREATE PUBLIC DATABASE LINK', /[\s\t]*CREATE[\s\t]+PUBLIC[\s\t]+DATABASE[\s\t]+LINK/
        ],
        [
          'CREATE PUBLIC SYNONYM', /[\s\t]*CREATE[\s\t]+PUBLIC[\s\t]+SYNONYM/
        ],
        [
          'ALTER MATERIALIZED VIEW', /[\s\t]*ALTER[\s\t]+MATERIALIZED[\s\t]+VIEW/
        ],
        [
          'ALTER SEQUENCE', /[\s\t]*ALTER[\s\t]+SEQUENCE/
        ],
        [
          'ALTER SYNONYM', /[\s\t]*ALTER[\s\t]+SYNONYM/
        ],
        [
          'ALTER TRIGGER', /[\s\t]*ALTER[\s\t]+TRIGGER/
        ],
        [
          'ALTER TYPE', /[\s\t]*ALTER[\s\t]+TYPE/
        ],
        [
          'ALTER DATABASE LINK', /[\s\t]*ALTER[\s\t]+DATABASE[\s\t]+LINK/
        ],
        [
          'DROP DIRECTORY', /[\s\t]*DROP[\s\t]+DIRECTORY/
        ],
        [
          'DROP MATERIALIZED VIEW', /[\s\t]*DROP[\s\t]+MATERIALIZED[\s\t]+VIEW/
        ],
        [
          'DROP SEQUENCE', /[\s\t]*DROP[\s\t]+SEQUENCE/
        ],
        [
          'DROP SYNONYM', /[\s\t]*DROP[\s\t]+SYNONYM/
        ],
        [
          'DROP TRIGGER', /[\s\t]*DROP[\s\t]+TRIGGER/
        ],
        [
          'DROP VIEW', /[\s\t]*DROP[\s\t]+VIEW/
        ],
        [
          'DROP PUBLIC DATABASE LINK', /[\s\t]*DROP[\s\t]+PUBLIC[\s\t]+DATABASE[\s\t]+LINK/
        ],
        [
          'DROP PUBLIC SYNONYM', /[\s\t]*DROP[\s\t]+PUBLIC[\s\t]+SYNONYM/
        ]
      ])
    ]
  ])

  public validRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 指定「Select count(1)」或「Select count(*)」
      GroupType.CountSQL, new TSMap<string, RegExp>([
        [
          'SELECT COUNT', /^[\s\t]*SELECT[\s\t]+COUNT\([\s\t]*[*|1][\s\t]*\)/
        ]
      ])
    ],
    [
      //* 指定「Select *」或「Select欄位」
      GroupType.SelectSQL, new TSMap<string, RegExp>([
        [
          'SELECT', /^[\s\t]*SELECT[\s\t]+/
        ]
      ])
    ],
    [
      //* 指定「Insert into」、「Update set」、「Delete」、「Select into」
      GroupType.MainSQL, new TSMap<string, RegExp>([
        [
          'INSERT INTO', /^[\s\t]*INSERT[\s\t]+INTO[\s\t]+/
        ],
        [
          'UPDATE', /^[\s\t]*UPDATE[\s\t]+/
        ],
        [
          'DELETE', /^[\s\t]*DELETE[\s\t]+/
        ],
        [
          'SELECT INTO', /^[\s\t]*SELECT[\s\t]+.*[\s\t]+INTO/
        ]
      ])
    ]
  ])

  public invalidRegExpMapDDL = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 不允許 DML 語法
      //* 不允許 DDL 語法
      //* 不允許 GRANT、REVOKE 語法
      //* 例外 : CREATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : ALTER TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : TRUNCATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : INSERT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : UPDATE (TOP (N) (PERCENT)) #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : SELECT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DELETE (TOP (N) (PERCENT))  FROM #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DROP TABLE #TEMP_TABLE|##TEMP_TABLE
      GroupType.PreSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DELETE', /^[\s\t]*DELETE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?FROM[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'INSERT INTO', /^[\s\t]*INSERT[\s\t]+INTO[\s\t]+(?![\s\t]*(#|##)[A-Za-z0-9]+)/
        ],
        [
          'SELECT', /^[\s\t]*SELECT[\s\t]+(?![\s\t]*.*[\s\t]+INTO[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'ALTER', /^[\s\t]*ALTER[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DROP', /^[\s\t]*DROP[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT[\s\t]+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE[\s\t]+/
        ]
      ])
    ],
    [
      //* 不允許 DML 語法
      //* 不允許 DDL 語法
      //* 不允許 GRANT、REVOKE 語法
      //* 例外 : CREATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : ALTER TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : TRUNCATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : INSERT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : UPDATE (TOP (N) (PERCENT)) #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : SELECT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DELETE (TOP (N) (PERCENT))  FROM #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DROP TABLE #TEMP_TABLE|##TEMP_TABLE
      GroupType.PreProdSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DELETE', /^[\s\t]*DELETE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?FROM[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'INSERT INTO', /^[\s\t]*INSERT[\s\t]+INTO[\s\t]+(?![\s\t]*(#|##)[A-Za-z0-9]+)/
        ],
        [
          'SELECT', /^[\s\t]*SELECT[\s\t]+(?![\s\t]*.*[\s\t]+INTO[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'ALTER', /^[\s\t]*ALTER[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DROP', /^[\s\t]*DROP[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT[\s\t]+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE[\s\t]+/
        ]
      ])
    ],
    [
      //* 不允許 DML 語法
      //* 不允許 DDL 語法
      //* 不允許 GRANT、REVOKE 語法
      //* 例外 : CREATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : ALTER TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : TRUNCATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : INSERT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : UPDATE (TOP (N) (PERCENT)) #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : SELECT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DELETE (TOP (N) (PERCENT))  FROM #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DROP TABLE #TEMP_TABLE|##TEMP_TABLE
      GroupType.PostSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DELETE', /^[\s\t]*DELETE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?FROM[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'INSERT INTO', /^[\s\t]*INSERT[\s\t]+INTO[\s\t]+(?![\s\t]*(#|##)[A-Za-z0-9]+)/
        ],
        [
          'SELECT', /^[\s\t]*SELECT[\s\t]+(?![\s\t]*.*[\s\t]+INTO[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'ALTER', /^[\s\t]*ALTER[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DROP', /^[\s\t]*DROP[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT[\s\t]+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE[\s\t]+/
        ]
      ])
    ]
  ])

  public invalidRegExpMapDML = new TSMap<GroupType, TSMap<string, RegExp>>([
    [
      //* 不允許 DML 語法
      //* 不允許 DDL 語法
      //* 不允許 GRANT、REVOKE 語法
      //* 例外 : CREATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : ALTER TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : TRUNCATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : INSERT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : UPDATE (TOP (N) (PERCENT)) #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : SELECT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DELETE (TOP (N) (PERCENT))  FROM #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DROP TABLE #TEMP_TABLE|##TEMP_TABLE
      GroupType.PreSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DELETE', /^[\s\t]*DELETE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?FROM[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'INSERT INTO', /^[\s\t]*INSERT[\s\t]+INTO[\s\t]+(?![\s\t]*(#|##)[A-Za-z0-9]+)/
        ],
        [
          'SELECT', /^[\s\t]*SELECT[\s\t]+(?![\s\t]*.*[\s\t]+INTO[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'ALTER', /^[\s\t]*ALTER[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DROP', /^[\s\t]*DROP[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT[\s\t]+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE[\s\t]+/
        ]
      ])
    ],
    [
      //* 不允許 DML 語法
      //* 不允許 DDL 語法
      //* 不允許 GRANT、REVOKE 語法
      //* 例外 : CREATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : ALTER TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : TRUNCATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : INSERT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : UPDATE (TOP (N) (PERCENT)) #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : SELECT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DELETE (TOP (N) (PERCENT))  FROM #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DROP TABLE #TEMP_TABLE|##TEMP_TABLE
      GroupType.PreProdSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DELETE', /^[\s\t]*DELETE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?FROM[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'INSERT INTO', /^[\s\t]*INSERT[\s\t]+INTO[\s\t]+(?![\s\t]*(#|##)[A-Za-z0-9]+)/
        ],
        [
          'SELECT', /^[\s\t]*SELECT[\s\t]+(?![\s\t]*.*[\s\t]+INTO[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'ALTER', /^[\s\t]*ALTER[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DROP', /^[\s\t]*DROP[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT[\s\t]+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE[\s\t]+/
        ]
      ])
    ],
    [
      //* 不允許 DML 語法
      //* 不允許 DDL 語法
      //* 不允許 GRANT、REVOKE 語法
      //* 例外 : CREATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : ALTER TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : TRUNCATE TABLE #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : INSERT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : UPDATE (TOP (N) (PERCENT)) #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : SELECT INTO #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DELETE (TOP (N) (PERCENT))  FROM #TEMP_TABLE|##TEMP_TABLE
      //* 例外 : DROP TABLE #TEMP_TABLE|##TEMP_TABLE
      GroupType.PostSQL, new TSMap<string, RegExp>([
        //* DML
        [
          'UPDATE', /^[\s\t]*UPDATE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DELETE', /^[\s\t]*DELETE[\s\t]+(?![\s\t]*(TOP[\s\t]+\([\s\t]*[0-9]+[\s\t]*\)[\s\t]+(PERCENT[\s\t]+)?)?FROM[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'INSERT INTO', /^[\s\t]*INSERT[\s\t]+INTO[\s\t]+(?![\s\t]*(#|##)[A-Za-z0-9]+)/
        ],
        [
          'SELECT', /^[\s\t]*SELECT[\s\t]+(?![\s\t]*.*[\s\t]+INTO[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* DDL
        [
          'CREATE', /^[\s\t]*CREATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'ALTER', /^[\s\t]*ALTER[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'DROP', /^[\s\t]*DROP[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        [
          'TRUNCATE', /^[\s\t]*TRUNCATE[\s\t]+(?![\s\t]*TABLE[\s\t]+(#|##)[A-Za-z0-9]+)/
        ],
        //* GRANT & REVOKE
        [
          'GRANT', /^[\s\t]*GRANT[\s\t]+/
        ],
        [
          'REVOKE', /^[\s\t]*REVOKE[\s\t]+/
        ]
      ])
    ]
  ])
}
