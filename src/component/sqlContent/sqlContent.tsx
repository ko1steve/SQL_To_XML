import React from 'react'
import { ImportSqlButton } from 'src/element/importSqlButton/importSqlButton'
import { CommandTab } from 'src/element/commandTab/commandTab'
import { CommandType } from 'src/mainConfig'
import { ExportXmlButton } from 'src/element/exportXmlButton/exportXmlButton'

export const SqlContent: React.FC = () => {
  return (
    <div className='col-8 container position-relative'>
      <div className='d-flex justify-content-right position-absolute end-0'>
        <ImportSqlButton />
        <ExportXmlButton />
      </div>
      <ul className='nav nav-tabs' id='commandTypeTabs' role='tablist'>
        <CommandTab sqlType={CommandType.DML} active={true} />
        <CommandTab sqlType={CommandType.DDL} active={false} />
      </ul>
      <div className='tab-content mt-3' id='commandTypeTabsContent'>
        <div className='tab-pane fade show active' id='dml' role='tabpanel' aria-labelledby='dml-tab'>
          <div className='text-center container' id='main-container-DML'>
          </div>
        </div>
        <div className='tab-pane fade' id='ddl' role='tabpanel' aria-labelledby='ddl-tab'>
          <div className='text-center container' id='main-container-DDL'>
          </div>
        </div>
      </div>
    </div>
  )
}
