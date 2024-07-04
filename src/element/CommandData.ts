export enum MessageType {
  COMMENT_OUT_COMMAND = 'IGNORED_COMMAND',
  CONTENT_NOT_FOUND_ERROR = 'CONTENT_NOT_FOUND_ERROR',
  INVALID_COMMAND_ERROR = 'INVALID_COMMAND_ERROR',
  NO_VALID_COMMAND_ERROR = 'NO_VALID_COMMAND_ERROR',
  NONE = 'NONE'
}

export interface ICommandData {
  content: string
  detail: ICommandDataDetail
}

export interface ICommandDataDetail {
  messageType: MessageType
  commands: string[]
}

export class CommandData implements ICommandData {
  public content: string
  public detail: ICommandDataDetail

  constructor (content: string, detail: ICommandDataDetail) {
    this.content = content
    this.detail = detail
  }
}

export class StringBuilder {
  protected _strings: string[]
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
