import * as fs from 'fs'
import { expect } from 'chai';
import { SqlHandler } from '../../../src/core/sqlHandler/sqlHandler'
import { CommandType, GroupType } from '../../../src/mainConfig';
import { TSMap } from 'typescript-map';
import { CommandData } from 'src/data/commandData';

class MockSqlHandler extends SqlHandler {
  protected itemMap: TSMap<string, unknown> = new TSMap<string, unknown>()

  protected initLocalForge (): void {
    if (!this.itemMap) {
      this.itemMap = new TSMap<string, unknown>()
    } else {
      this.itemMap.clear()
    }
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

describe('SqlHandler', () => {
  const sqlHandler = new MockSqlHandler(CommandType.DML)
  it('getItem', async () => {
    const textFromFileLoaded: string = fs.readFileSync('tests/core/sqlHandler/example/exampleDml_1.sql').toString()
    await sqlHandler.transTextToCommand(textFromFileLoaded)
    const commands: CommandData[] | null = await sqlHandler.getItem<CommandData[]>(GroupType.MainSQL + '-command') || []
    expect(commands.length).greaterThan(0)
  })
})