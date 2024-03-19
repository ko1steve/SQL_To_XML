import { CommandType } from 'src/mainConfig'

export class TabContentConfig implements ITabContentConfig {
  constructor (commandType: CommandType) {
    this.commandType = commandType
    this.updateConfigByCommandType(this)
  }

  protected updateConfigByCommandType (obj: any) {
    Object.getOwnPropertyNames(obj).forEach(k => {
      if (typeof obj[k] === 'object') {
        if (Object.prototype.hasOwnProperty.call(obj[k], 'id')) {
          obj[k].id = (obj[k].id as string).replace('{commandType}', this.commandType)
          this.updateConfigByCommandType(obj[k])
        }
      }
    })
  }

  public commandType: CommandType = CommandType.NONE

  public mainContainer: IMainContainerConfig = {
    id: 'main-container-{commandType}',
    className: '',
    contentContainer: {
      id: 'content-container-{commandType}',
      className: ''
    }
  }

  public groupContainer: IGroupContainerConfig = {
    id: 'groupContainer-{groupType}-{commandType}',
    className: 'groupContainer row',
    warningMessageContainer: {
      id: 'warningMessageContainer-{commandType}',
      className: 'col-2 col-md-3 warningContainer',
      warningMessage: {
        id: 'warning-message-{index}-{commandType}',
        className: 'warning-message'
      }
    },
    commandContainer: {
      id: 'commandContainer-{groupType}-{commandType}',
      className: 'col-8 col-md-6 commandContainer',
      title: {
        id: '{groupType}-title-{commandType}',
        className: 'fw-bold fs-3'
      },
      paragraph: {
        id: '{groupType}-command-{index}-{commandType}',
        className: 'command'
      }
    },
    errorMessageContainer: {
      id: 'errorMessageContainer-{commandType}',
      className: 'col-2 col-md-3 errorMessageContainer',
      errorMessage: {
        id: 'error-message-{index}-{commandType}',
        className: 'error-message'
      }
    }
  }

  public downloadButtonContainer: IDownloadButtonContainer = {
    id: 'downloadButtonContainer-{commandType}',
    className: 'container',
    downloadButton: {
      id: 'downloadButton-{commandType}',
      className: 'downloadButton',
      textContent: 'Download as XML'
    }
  }
}

export interface IHTMLElementConfig {
  id: string
  className: string
  innerText?: string
  textContent?: string
}

export interface ITabContentConfig {
  commandType: CommandType;
  mainContainer: IMainContainerConfig
  groupContainer: IGroupContainerConfig
  downloadButtonContainer: IDownloadButtonContainer
}

export interface IMainContainerConfig extends IHTMLElementConfig {
  contentContainer: IHTMLElementConfig
}

export interface IGroupContainerConfig extends IHTMLElementConfig {
  warningMessageContainer: IWarningMessageContainer
  commandContainer: ICommandContainer
  errorMessageContainer: IErrorMessageContainer
}

export interface IDownloadButtonContainer extends IHTMLElementConfig {
  downloadButton: IHTMLElementConfig
}

export interface ICommandContainer extends IHTMLElementConfig {
  title: IHTMLElementConfig
  paragraph: IHTMLElementConfig
}

export interface IWarningMessageContainer extends IHTMLElementConfig {
  warningMessage: IHTMLElementConfig
}

export interface IErrorMessageContainer extends IHTMLElementConfig {
  errorMessage: IHTMLElementConfig
}
