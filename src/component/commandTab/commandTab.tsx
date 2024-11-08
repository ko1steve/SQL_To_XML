import React from 'react'
import { CommandType } from 'src/mainConfig'
import { DataModel } from 'src/model/dataModel'
import { Container } from 'typescript-ioc'
import * as Config from './config'
import * as SqlContentConfig from 'src/component/sqlContentArea/config'

interface ICommamdTabProps {
  sqlType: CommandType
  active: boolean
}

export const CommandTab: React.FC<ICommamdTabProps> = ({ sqlType, active }) => {
  const handleOnClick = () => {
    const dataModel = Container.get(DataModel)
    dataModel.currentTab = sqlType
  }
  let commandTabId: string = ''
  let targetPanelId: string = ''
  switch (sqlType) {
    case CommandType.DML:
      commandTabId = Config.commandTabDml.id
      targetPanelId = SqlContentConfig.commadnTypePanelDml.id
      break
    case CommandType.DDL:
      commandTabId = Config.commandTabDdl.id
      targetPanelId = SqlContentConfig.commadnTypePanelDdl.id
      break
  }
  return (
    <li key={'tab-' + sqlType} className='nav-item' role='presentation'>
      <button className={`nav-link ${(active ? 'active' : '')}`} id={commandTabId} data-bs-toggle='tab' data-bs-target={'#' + targetPanelId} type='button'
        role='tab' aria-controls={targetPanelId} aria-selected={active} onClick={handleOnClick}>{sqlType}</button>
    </li>
  )
}
