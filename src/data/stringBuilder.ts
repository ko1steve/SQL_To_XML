import { Common } from '../util/common'

export class StringBuilder {
  protected _strings: string[]

  public get strings (): string[] {
    return this._strings
  }

  public get size (): number {
    return this._strings.length
  }

  constructor () {
    this._strings = []
  }

  append (str: string) {
    this._strings.push(str)
  }

  toString (symbol: string = Common.EmptyString) {
    return this._strings.join(symbol)
  }
}
