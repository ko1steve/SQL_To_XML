import React from 'react'
import { CommandType } from 'src/mainConfig'
import { DataModel } from 'src/model/dataModel'
import { Container } from 'typescript-ioc'
import * as Config from './config'
import * as SqlContentConfig from 'src/component/sqlContent/config'

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
      commandTabId = Config.commandTabIdDml
      targetPanelId = SqlContentConfig.commadnTypePanelIdDml
      break
    case CommandType.DDL:
      commandTabId = Config.commandTabIdDdl
      targetPanelId = SqlContentConfig.commadnTypePanelIdDdl
      break
  }
  return (
    <li className='nav-item' role='presentation'>
      <button className={`nav-link ${(active ? 'active' : '')}`} id={commandTabId} data-bs-toggle='tab' data-bs-target={'#' + targetPanelId} type='button'
        role='tab' aria-controls={targetPanelId} aria-selected={`${(active ? 'true' : 'false')}`} onClick={handleOnClick}>{sqlType}</button>
    </li>
  )
}
