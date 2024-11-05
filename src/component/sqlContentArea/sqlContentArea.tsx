import React from 'react'
import { ImportSqlButton } from 'src/element/importSqlButton/importSqlButton'
import { CommandTab } from 'src/component/commandTab/commandTab'
import { CommandType } from 'src/mainConfig'
import { ExportXmlButton } from 'src/element/exportXmlButton/exportXmlButton'
import * as Config from './config'
import * as CommandTabConfig from 'src/component/commandTab/config'

export const SqlContentArea: React.FC = () => {
  return (
    <div className={Config.sqlContentContainer.className}>
      <div className={Config.buttonListContainer.className}>
        <ImportSqlButton className={Config.importSqlButton.className} id={Config.importSqlButton.id}
          label={Config.importSqlButton.label} input={Config.importSqlButton.input} />
        <ExportXmlButton className={Config.exportXmlButton.className} id={Config.exportXmlButton.id} />
      </div>
      <ul className={Config.commandTypeTabs.className} role='tablist'>
        <CommandTab sqlType={CommandType.DML} active={true} />
        <CommandTab sqlType={CommandType.DDL} active={false} />
      </ul>
      <div className={Config.commandTypeTabsContent.className}>
        <div className='tab-pane fade show active' id={Config.commadnTypePanelDml.id} role='tabpanel' aria-labelledby={CommandTabConfig.commandTabDml.id}>
          <div className={Config.commandMainContainerDml.className} id={Config.commandMainContainerDml.id}>
          </div>
        </div>
        <div className='tab-pane fade' id={Config.commadnTypePanelDdl.id} role='tabpanel' aria-labelledby={CommandTabConfig.commandTabDdl.id}>
          <div className={Config.commandMainContainerDdl.className} id={Config.commandMainContainerDdl.id}>
          </div>
        </div>
      </div>
    </div>
  )
}
