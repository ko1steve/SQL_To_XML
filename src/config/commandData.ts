export enum MessageType {
  CONTENT_NOT_FOUND_ERROR = 'CONTENT_NOT_FOUND_ERROR',
  INVALID_COMMAND_ERROR = 'INVALID_COMMAND_ERROR',
  NO_VALID_COMMAND_ERROR = 'NO_VALID_COMMAND_ERROR',
  EXCEENDS_COMMAND_LIMIT_ERROR = 'EXCEENDS_COMMAND_LIMIT_ERROR',
  EMPTY_OR_COMMENT_ONLY_ERROR = 'EMPTY_OR_COMMENT_ONLY_ERROR',
  NONE = 'NONE'
}

export interface ICommandData {
  content: StringBuilder
  details: ICommandDataDetail[]
}

export interface ICommandDataDetail {
  messageType: MessageType
  command: string
}

export class CommandData implements ICommandData {
  public content: StringBuilder
  public details: ICommandDataDetail[]

  constructor (content: StringBuilder, details: ICommandDataDetail[]) {
    this.content = content
    this.details = details
  }
}

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

  toString (symbol: string = '') {
    return this._strings.join(symbol)
  }
}
