import React from 'react'
import ImportSqlButton from 'src/component/importSqlButton/importSqlButton'
import SqlTypeTab from '../sqlTypeTab/SqlTypeTab'

const SqlContent: React.FC = () => {
  return (
    <div className='col-8 container position-relative'>
      <div className='d-flex justify-content-right position-absolute end-0'>
        <ImportSqlButton />
        <div className='download-button-container'>
          <button id='download-button'>Export as XML</button>
        </div>
      </div>
      <ul className='nav nav-tabs' id='commandTypeTabs' role='tablist'>
        <SqlTypeTab sqlType='DML' active={true} />
        <SqlTypeTab sqlType='DDL' active={false} />
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
export default SqlContent
