import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'src/styles.css'
import { CommandType } from './mainConfig'
import { TabContentComponent } from './component/tabContent/tabContentComponent'

const fileInputDdl: HTMLInputElement = document.getElementById('fileInput-DDL') as HTMLInputElement
const fileInputDml: HTMLInputElement = document.getElementById('fileInput-DML') as HTMLInputElement

if (fileInputDdl != null) {
  fileInputDdl.onchange = onFileInput.bind(this, fileInputDdl)
}
if (fileInputDml != null) {
  fileInputDml.onchange = onFileInput.bind(this, fileInputDml)
}

const tabContentMap: Map<CommandType, TabContentComponent> = new Map()

function onFileInput(fileInput: HTMLInputElement): void {
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