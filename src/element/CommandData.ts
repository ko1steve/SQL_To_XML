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
  commandText: string
}

export class CommandData implements ICommandData {
  protected _content: string
  protected _detail: ICommandDataDetail

  constructor (content: string, detail: ICommandDataDetail) {
    this._content = content
    this._detail = detail
  }

  public get content (): string {
    return this._content
  }

  public set content (content: string) {
    this._content = content
  }

  public get detail (): ICommandDataDetail {
    return this._detail
  }
}
