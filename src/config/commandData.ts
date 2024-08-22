export enum MessageType {
  CONTENT_NOT_FOUND_ERROR = 'CONTENT_NOT_FOUND_ERROR',
  INVALID_COMMAND_ERROR = 'INVALID_COMMAND_ERROR',
  NO_VALID_COMMAND_ERROR = 'NO_VALID_COMMAND_ERROR',
  EXCEENDS_COMMAND_LIMIT_ERROR = 'EXCEENDS_COMMAND_LIMIT_ERROR',
  EMPTY_OR_COMMENT_ONLY_ERROR = 'EMPTY_OR_COMMENT_ONLY_ERROR',
  COMMAND_INDICATOR_NOT_FOUND_ERROR = 'COMMAND_INDICATOR_NOT_FOUND_ERROR',
  NO_GROUP_TAG = 'NO_GROUP_TAG',
  NONE = 'NONE'
}

export interface ICommandData {
  content: StringBuilder
  messages: ICommandDataMessage[]
}

export interface ICommandDataMessage {
  messageType: MessageType
  command: string
  globalTextLineIndex: number
  commandIndex: number
}

export interface IGroupCommandDetail {
  startIndex: number
  lines: number
}

export interface ICommandDataDetail {
  groupTextLineIndex: number
  commandIndex: number
}

export interface IIndicateCommandErrorData {
  commandIndex: number
  isBlank: boolean
}

export class CommandData implements ICommandData {
  public content: StringBuilder
  public messages: ICommandDataMessage[]

  constructor (content: StringBuilder, messages: ICommandDataMessage[]) {
    this.content = content
    this.messages = messages
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
