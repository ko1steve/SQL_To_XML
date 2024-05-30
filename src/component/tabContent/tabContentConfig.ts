import { IHtmlElementConfig } from 'src/element/HtmlConfig'
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
    commandContainer: {
      id: 'commandContainer-{groupType}-{commandType}',
      className: 'col-8 col-md-8 commandContainer mx-auto',
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
      id: 'errorMessageContainer-{groupType}-{commandType}',
      className: 'col-4 col-md-4 errorMessageContainer',
      warningMessage: {
        id: 'warning-message-{index}-{commandType}',
        className: 'warning-message'
      },
      errorMessage: {
        id: 'error-message-{index}-{commandType}',
        className: 'error-message'
      }
    }
  }
}

export interface ITabContentConfig {
  commandType: CommandType;
  mainContainer: IMainContainerConfig
  groupContainer: IGroupContainerConfig
}

export interface IMainContainerConfig extends IHtmlElementConfig {
  contentContainer: IHtmlElementConfig
}

export interface IGroupContainerConfig extends IHtmlElementConfig {
  commandContainer: ICommandContainer
  errorMessageContainer: IErrorMessageContainer
}

export interface ICommandContainer extends IHtmlElementConfig {
  title: IHtmlElementConfig
  paragraph: IHtmlElementConfig
}

export interface IErrorMessageContainer extends IHtmlElementConfig {
  warningMessage: IHtmlElementConfig
  errorMessage: IHtmlElementConfig
}
