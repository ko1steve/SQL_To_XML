import { Common } from '../../util/common'

export const sqlContentContainer = {
  className: 'col-8 container position-relative'
}

export const buttonListContainer = {
  className: 'd-flex justify-content-right position-absolute end-0'
}

export const commandTypeTabs = {
  className: 'nav nav-tabs'
}

export const commandTypeTabsContent = {
  className: 'tab-content mt-3'
}

export const commadnTypePanelDml = {
  id: 'dml-panel'
}
export const commadnTypePanelDdl = {
  id: 'ddl-panel'
}

export const commandMainContainerDml = {
  className: 'text-center container',
  id: 'main-container-dml'
}

export const commandMainContainerDdl = {
  className: 'text-center container',
  id: 'main-container-ddl'
}

export const importSqlButton = {
  className: 'import-sql-button',
  id: 'import-sql-button',
  label: {
    className: 'file-input-label',
    id: 'file-input-label-DML'
  },
  input: {
    className: 'file-input',
    id: 'file-input-DML'
  }
}

export const exportXmlButton = {
  className: Common.EmptyString,
  id: 'export-xml-button'
}
