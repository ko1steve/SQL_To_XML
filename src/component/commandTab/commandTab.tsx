import React from 'react'
import { Container } from 'typescript-ioc'
import { CommandType } from '../../mainConfig'
import { DataModel } from '../../model/dataModel'
import * as SqlContentConfig from '../../component/sqlContentArea/config'
import { Common } from '../../util/common'
import * as Config from './config'

interface ICommamdTabProps {
  sqlType: CommandType
  active: boolean
}

export const CommandTab: React.FC<ICommamdTabProps> = ({ sqlType, active }) => {
  const handleOnClick = () => {
    const dataModel = Container.get(DataModel)
    dataModel.currentTab = sqlType
  }
  let commandTabId = Common.EmptyString
  let targetPanelId = Common.EmptyString
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
      <button className={`nav-link ${(active ? 'active' : Common.EmptyString)}`} id={commandTabId} data-bs-toggle='tab' data-bs-target={'#' + targetPanelId} type='button'
        role='tab' aria-controls={targetPanelId} aria-selected={active} onClick={handleOnClick}>{sqlType}</button>
    </li>
  )
}
