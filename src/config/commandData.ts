export enum MessageType {
  CONTENT_NOT_FOUND_ERROR = 'CONTENT_NOT_FOUND_ERROR',
  INVALID_COMMAND_ERROR = 'INVALID_COMMAND_ERROR',
  NO_VALID_COMMAND_ERROR = 'NO_VALID_COMMAND_ERROR',
  EXCEENDS_COMMAND_LIMIT_ERROR = 'EXCEENDS_COMMAND_LIMIT_ERROR',
  NONE = 'NONE'
}

export interface ICommandData {
  content: string
  details: ICommandDataDetail[]
}

export interface ICommandDataDetail {
  messageType: MessageType
  command: string
}

export class CommandData implements ICommandData {
  public content: string
  public details: ICommandDataDetail[]

  constructor (content: string, details: ICommandDataDetail[]) {
    this.content = content
    this.details = details
  }
}

export class StringBuilder {
  protected _strings: string[]

  public get strings (): string[] {
    return this._strings
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
