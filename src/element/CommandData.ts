
export class CommandData implements ICommandData {

  protected _content: string;
  protected _status: CommandStatus;
  protected _detail: ICommandDataDetail;

  constructor(content: string, status: CommandStatus = CommandStatus.valid, detail?: ICommandDataDetail) {
    this._content = content
    this._status = status
    if (detail) {
      this._detail = detail
    }
  }

  public get content(): string {
    return this._content
  }

  public get status(): CommandStatus {
    return this._status
  }

  public get detail(): ICommandDataDetail {
    return this._detail
  }
}

export interface ICommandData {
  content: string
  status: CommandStatus
}

export enum CommandStatus {
  valid = 'valid',
  invalid = 'invalid',
  ignored = 'ignored'
}

export enum ErrorType {
  CONTENT_NOT_FOUND_ERROR = 'CONTENT_NOT_FOUND_ERROR',
  INVALID_COMMAND_ERROR = 'INVALID_COMMAND_ERROR',
  NONE = 'NONE'
}

export interface ICommandDataDetail {
  errorType: ErrorType
  commands: string[]
}