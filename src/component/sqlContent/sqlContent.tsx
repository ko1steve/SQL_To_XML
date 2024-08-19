import React from 'react'
import { ImportSqlButton } from 'src/element/importSqlButton/importSqlButton'
import { CommandTab } from 'src/component/commandTab/commandTab'
import { CommandType } from 'src/mainConfig'
import { ExportXmlButton } from 'src/element/exportXmlButton/exportXmlButton'
import * as Config from './config'
import * as CommandTabConfig from 'src/component/commandTab/config'

export const SqlContent: React.FC = () => {
  return (
    <div className={Config.sqlContentContainerClass}>
      <div className={Config.buttonListContainerClass}>
        <ImportSqlButton />
        <ExportXmlButton />
      </div>
      <ul className={Config.commandTypeTabsClass} role='tablist'>
        <CommandTab sqlType={CommandType.DML} active={true} />
        <CommandTab sqlType={CommandType.DDL} active={false} />
      </ul>
      <div className={Config.commandTypeTabsContentClass}>
        <div className='tab-pane fade show active' id={Config.commadnTypePanelIdDml} role='tabpanel' aria-labelledby={CommandTabConfig.commandTabIdDml}>
          <div className={Config.commandMainContainerClass} id={Config.commandMainContainerDmlId}>
          </div>
        </div>
        <div className='tab-pane fade' id={Config.commadnTypePanelIdDdl} role='tabpanel' aria-labelledby={CommandTabConfig.commandTabIdDdl}>
          <div className={Config.commandMainContainerClass} id={Config.commandMainContainerDdlId}>
          </div>
        </div>
      </div>
    </div>
  )
}
