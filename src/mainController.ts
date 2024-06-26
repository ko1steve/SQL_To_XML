import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'src/styles.css'
import { CommandType } from './mainConfig'
import { TabContentController } from './component/tabContent/tabContentController'
import TopButtonImage from './image/top-button.png'
import jschardet from 'jschardet'

export class MainController {
  protected tabContentControllerMap: Map<CommandType, TabContentController> = new Map()

  protected currentCommandType: CommandType = CommandType.DML

  protected topButton: HTMLImageElement | null = null

  constructor () {
    this.createTopButton()
    this.addEventListeners()
  }

  protected createTopButton (): void {
    const topButtonContainer = document.getElementById('top-button-container')

    this.topButton = document.createElement('img')
    this.topButton.id = 'top-button'
    this.topButton.src = TopButtonImage
    topButtonContainer?.appendChild(this.topButton)

    this.topButton.onclick = () => {
      window.scrollTo({
        top: 0
      })
    }
  }

  protected addEventListeners (): void {
    const fileInputDdl: HTMLInputElement = document.getElementById('file-input-DDL') as HTMLInputElement
    if (fileInputDdl != null) {
      fileInputDdl.onchange = this.onFileInput.bind(this, fileInputDdl)
    }
    const fileInputDml: HTMLInputElement = document.getElementById('file-input-DML') as HTMLInputElement
    if (fileInputDml != null) {
      fileInputDml.onchange = this.onFileInput.bind(this, fileInputDml)
    }
    const dmlTab = document.getElementById('dml-tab')
    if (dmlTab != null) {
      dmlTab.onclick = this.onNavClick.bind(this, CommandType.DML)
    }
    const ddlTab = document.getElementById('ddl-tab')
    if (ddlTab != null) {
      ddlTab.onclick = this.onNavClick.bind(this, CommandType.DDL)
    }
    const downloadButton = document.getElementById('download-button')
    if (downloadButton != null) {
      downloadButton.onclick = this.onDownloadClick.bind(this)
    }
    const exampleButton = document.getElementById('download-example-button')
    if (exampleButton != null) {
      exampleButton.onclick = this.onDownloadExampleClick.bind(this)
    }
  }

  protected onFileInput (fileInput: HTMLInputElement): void {
    if (!fileInput || !fileInput.files || fileInput?.files?.length === 0) {
      return
    }
    const file: File = fileInput.files[0]
    let commandType: CommandType = CommandType.NONE
    Object.values(CommandType).forEach(e => {
      if (e.toString() === fileInput.dataset.sqlType) {
        commandType = e
      }
    })
    if (commandType === CommandType.NONE) {
      return
    }
    const arrayBufferReader: FileReader = new FileReader()
    arrayBufferReader.onload = (event) => {
      if (event.target == null) {
        return
      }
      const arrayBuffer: ArrayBuffer = event.target.result as ArrayBuffer

      //* 將 ArrayBuffer 轉成 String Type
      const uint8Array: Uint8Array = new Uint8Array(arrayBuffer)
      const binaryString: string = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')

      //* 偵測文字編碼
      const detectedInfo: jschardet.IDetectedMap = jschardet.detect(binaryString)

      const textReader = new FileReader()
      textReader.onload = (event) => {
        if (event.target == null) {
          return
        }
        const text = event.target.result as string
        if (this.tabContentControllerMap.has(commandType)) {
          const tabContentController = this.tabContentControllerMap.get(commandType) as TabContentController
          tabContentController.resetPageContent(text)
        } else {
          const tabContentController = new TabContentController(commandType, text)
          this.tabContentControllerMap.set(commandType, tabContentController)
        }
      }
      //* 以偵測到的編碼讀取文字檔
      if (fileInput.files != null) {
        textReader.readAsText(file, detectedInfo.encoding)
      }
      fileInput.files = null
      fileInput.value = ''
    }
    //* 將文字檔讀取為 ArrayBuffer Type
    if (fileInput.files != null) {
      arrayBufferReader.readAsArrayBuffer(file)
    }
  }

  protected onNavClick (commandType: CommandType) {
    this.currentCommandType = commandType
    const uplloadButtonContainer = document.getElementsByClassName('upload-button-container')[0]

    const label: HTMLLabelElement = uplloadButtonContainer.getElementsByTagName('label')[0]
    label.id = label.id.replace(CommandType.DDL, commandType).replace(CommandType.DML, commandType)
    label.htmlFor = label.htmlFor.replace(CommandType.DDL, commandType).replace(CommandType.DML, commandType)

    const input: HTMLInputElement = uplloadButtonContainer.getElementsByTagName('input')[0]
    input.id = input.id.replace(CommandType.DDL, commandType).replace(CommandType.DML, commandType)
    input.dataset.sqlType = commandType

    if (this.tabContentControllerMap.has(commandType)) {
      const tabContentController = this.tabContentControllerMap.get(commandType) as TabContentController
      tabContentController.updateDownloadButtonStatus()
    }
  }

  protected onDownloadClick (): void {
    if (!this.tabContentControllerMap.has(this.currentCommandType)) {
      return
    }
    const tabContentController = this.tabContentControllerMap.get(this.currentCommandType)
    tabContentController?.downloadXML()
  }

  protected onDownloadExampleClick (): void {
    const xmlContent = '--#PreSQL\r\n' +
      '/*--!*/\r\n' +
      '--請放置前置語法\r\n' +
      '\r\n' +
      '--#CountSQL\r\n' +
      '/*--!*/\r\n' +
      '--請放置Count語法\r\n' +
      '\r\n' +
      '--#SelectSQL\r\n' +
      '/*--!*/\r\n' +
      '--請放置異動前/後語法\r\n' +
      '\r\n' +
      '--#MainSQL\r\n' +
      '/*--!*/\r\n' +
      '--請放置異動語法\r\n' +
      '\r\n' +
      '--#PostSQL\r\n' +
      '/*--!*/\r\n' +
      '--請放置後置語法'

    const blob = new Blob([xmlContent], { type: 'text/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'example.sql'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
