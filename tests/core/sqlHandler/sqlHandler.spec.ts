import * as fs from 'fs'
import { expect } from 'chai';
import { SqlHandler } from '../../../src/core/sqlHandler/sqlHandler'
import { CommandType, GroupType } from '../../../src/mainConfig';
import { TSMap } from 'typescript-map';
import { CommandData } from '../../../src/data/commandData';
import Result from './example/result.json'

class MockSqlHandler extends SqlHandler {
  protected itemMap: TSMap<string, unknown> = new TSMap<string, unknown>()

  protected initLocalForge (): void {
    if (!this.itemMap) {
      this.itemMap = new TSMap<string, unknown>()
    } else {
      this.itemMap.clear()
    }
  }

  public resetLocalForge (): Promise<void> {
    return new Promise<void>(resolve => {
      this.itemMap.clear()
      resolve()
    })
  }

  protected setItem (key: string, value: unknown): Promise<void> {
    return new Promise<void>(resolve => {
      this.itemMap.set(key, value)
      resolve()
    })
  }

  public getItem<T> (key: string): Promise<T | null> {
    return new Promise<T | null>(resolve => {
      const value: T = this.itemMap.get(key) as T
      resolve(value)
    })
  }
}

describe('SqlHandler(DML)', () => {
  const sqlHandler = new MockSqlHandler(CommandType.DML)

  it('transTextToCommand(textFromFileLoadedDml)', async () => {
    const textFromFileLoadedDml: string = fs.readFileSync('tests/core/sqlHandler/example/correct-dml-1.sql').toString()
    await sqlHandler.transTextToCommand(textFromFileLoadedDml)
  })

  it('getItem(DML-PreSQL-command)', async () => {
    const commandsPreSqlDml: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.PreSQL + '-command')
    expect(commandsPreSqlDml!.length).equal(0)
  })

  it('getItem(PreProdSQL-command)', async () => {
    const commandsPreProdSqlDml: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.PreProdSQL + '-command')
    expect(commandsPreProdSqlDml!.length).equal(0)
  })

  it('getItem(CountSQL-command)', async () => {
    const commandsCountSqlDml: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.CountSQL + '-command')
    expect(commandsCountSqlDml!.length).equal(1)
    expect(commandsCountSqlDml![0].content.toString('\r\n')).equal(Result.DML.CountSQL)
  })

  it('getItem(SelectSQL-command)', async () => {
    const commandsSelectSqlDml: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.SelectSQL + '-command')
    expect(commandsSelectSqlDml!.length).equal(1)
    expect(commandsSelectSqlDml![0].content.toString('\r\n')).equal(Result.DML.SelectSQL)
  })

  it('getItem(MainSQL-command)', async () => {
    const commandsMainSqlDml: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.MainSQL + '-command')
    expect(commandsMainSqlDml!.length).equal(1)
    expect(commandsMainSqlDml![0].content.toString('\r\n')).equal(Result.DML.MainSQL)
  })

  it('getItem(PostSQL-command)', async () => {
    const commandsPostSqlDml: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.PostSQL + '-command')
    expect(commandsPostSqlDml!.length).equal(0)
  })
})

describe('SqlHandler(DDL)', () => {
  const sqlHandler = new MockSqlHandler(CommandType.DDL)

  it('transTextToCommand(textFromFileLoadedDml)', async () => {
    const textFromFileLoadedDdl: string = fs.readFileSync('tests/core/sqlHandler/example/correct-ddl-1.sql').toString()
    await sqlHandler.transTextToCommand(textFromFileLoadedDdl)
  })

  it('getItem(PreSQL-command)', async () => {
    const commandsPreSqlDdl: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.PreSQL + '-command')
    expect(commandsPreSqlDdl!.length).equal(0)
  })

  it('getItem(PreProdSQL-command)', async () => {
    const commandsPreProdSqlDdl: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.PreProdSQL + '-command')
    expect(commandsPreProdSqlDdl!.length).equal(0)
  })

  it('getItem(CountSQL-command)', async () => {
    const commandsCountSqlDdl: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.CountSQL + '-command')
    expect(commandsCountSqlDdl!.length).equal(0)
  })

  it('getItem(SelectSQL-command)', async () => {
    const commandsSelectSqlDdl: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.SelectSQL + '-command')
    expect(commandsSelectSqlDdl!.length).equal(0)
  })

  it('getItem(MainSQL-command)', async () => {
    const commandsMainSqlDdl: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.MainSQL + '-command')
    expect(commandsMainSqlDdl!.length).equal(1)
    expect(commandsMainSqlDdl![0].content.toString('\r\n')).equal(Result.DDL.MainSQL)
  })

  it('getItem(PostSQL-command)', async () => {
    const commandsPostSqlDdl: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.PostSQL + '-command')
    expect(commandsPostSqlDdl!.length).equal(1)
    expect(commandsPostSqlDdl![0].content.toString('\r\n')).equal(Result.DDL.PostSQL)
  })
})