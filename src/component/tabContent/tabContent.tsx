import React from 'react'
import ImportSqlButton from 'src/component/importSqlButton/importSqlButton'

const TabContent: React.FC = () => {
  return (
    <div className='col-8 container position-relative'>
      <div className='d-flex justify-content-right position-absolute end-0'>
        <ImportSqlButton />
        <div className='download-button-container'>
          <button id='download-button'>Export as XML</button>
        </div>
      </div>
      <ul className='nav nav-tabs' id='commandTypeTabs' role='tablist'>
        <li className='nav-item' role='presentation'>
          <button className='nav-link active' id='dml-tab' data-bs-toggle='tab' data-bs-target='#dml' type='button'
            role='tab' aria-controls='dml' aria-selected='true'>DML</button>
        </li>
        <li className='nav-item' role='presentation'>
          <button className='nav-link' id='ddl-tab' data-bs-toggle='tab' data-bs-target='#ddl' type='button' role='tab'
            aria-controls='ddl' aria-selected='false'>DDL</button>
        </li>
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
export default TabContent
