import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'src/styles.css'
import { CommandType } from './mainConfig'
import { TabContentComponent } from './component/tabContent/tabContentComponent'

const fileInputDdl: HTMLInputElement = document.getElementById('fileInput-DDL') as HTMLInputElement
const fileInputDml: HTMLInputElement = document.getElementById('fileInput-DML') as HTMLInputElement

const tabContentMap: Map<CommandType, TabContentComponent> = new Map()

function onFileInput (fileInput: HTMLInputElement): void {
  if (fileInput?.files?.length === 0) {
    return
  }
  let commandType: CommandType = CommandType.NONE
  Object.values(CommandType).forEach(e => {
    if (e.toString() === fileInput.dataset.sqlType) {
      commandType = e
    }
  })
  if (commandType === CommandType.NONE) {
    return
  }
  const reader: FileReader = new FileReader()
  reader.onload = function (event) {
    if (event.target == null) {
      return
    }
    const textFromFileLoaded: string = event.target.result as string
    if (tabContentMap.has(commandType)) {
      const tabContent: TabContentComponent = tabContentMap.get(commandType) as TabContentComponent
      tabContent.resetPageContent(textFromFileLoaded)
    } else {
      const tabContent = new TabContentComponent(commandType, textFromFileLoaded)
      tabContentMap.set(commandType, tabContent)
    }
    fileInput.files = null
    fileInput.value = ''
  }
  if (fileInput.files != null) {
    reader.readAsText(fileInput.files[0], 'UTF-8')
  }
}

if (fileInputDdl != null) {
  fileInputDdl.onchange = onFileInput.bind(this, fileInputDdl)
}
if (fileInputDml != null) {
  fileInputDml.onchange = onFileInput.bind(this, fileInputDml)
}

const dmlTab = document.getElementById('dml-tab')
if (dmlTab != null) {
  dmlTab.onclick = onNavClick.bind(this, CommandType.DML)
}
const ddlTab = document.getElementById('ddl-tab')
if (ddlTab != null) {
  ddlTab.onclick = onNavClick.bind(this, CommandType.DDL)
}

function onNavClick (commamdType: CommandType) {
  const uplloadButtonContainer = document.getElementsByClassName('upload-button-container')[0]

  const label: HTMLLabelElement = uplloadButtonContainer.getElementsByTagName('label')[0]
  label.id = label.id.replace(CommandType.DDL, commamdType).replace(CommandType.DML, commamdType)
  label.htmlFor = label.htmlFor.replace(CommandType.DDL, commamdType).replace(CommandType.DML, commamdType)

  const input: HTMLInputElement = uplloadButtonContainer.getElementsByTagName('input')[0]
  input.id = input.id.replace(CommandType.DDL, commamdType).replace(CommandType.DML, commamdType)
  input.dataset.sqlType = commamdType
}
