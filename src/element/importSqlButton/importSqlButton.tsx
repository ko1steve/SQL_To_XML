import React from 'react'
import GetRawString, { IGetRawStringResponse } from 'src/util/worker/getRawString'
import jschardet from 'jschardet'
import { Container } from 'typescript-ioc'
import { DataModel } from 'src/model/dataModel'
import { SqlContentController } from 'src/core/sqlContent/sqlContentController'

export const ImportSqlButton: React.FC = () => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target || !event.target.files || event.target.files.length === 0) {
      return
    }
    const file: File = event.target.files[0]
    const arrayBufferReader: FileReader = new FileReader()
    const worker = new Worker(GetRawString)

    const overlay = document.getElementById('overlay') as HTMLDivElement
    overlay.style.display = 'flex'

    arrayBufferReader.onload = (event) => {
      if (event.target == null) {
        return
      }
      worker.onmessage = (event: any) => {
        const { type, data }: IGetRawStringResponse = event.data
        if (type === 'complete') {
          const detectMap: jschardet.IDetectedMap = jschardet.detect(data.rawString)
          const textReader = new FileReader()
          textReader.onload = (event) => {
            const dataModel = Container.get(DataModel)
            if (event.target == null) {
              return
            }
            const text = event.target.result as string
            if (dataModel.tabContentControllerMap.has(dataModel.currentTab)) {
              const tabContentController = dataModel.tabContentControllerMap.get(dataModel.currentTab)
              tabContentController.updateNewPageContent(text, file.name)
            } else {
              const tabContentController = new SqlContentController(dataModel.currentTab, text, file.name)
              dataModel.tabContentControllerMap.set(dataModel.currentTab, tabContentController)
            }
          }
          //* 以偵測到的編碼讀取文字檔
          console.log('encoding : ' + detectMap.encoding)
          console.log('confidence : ' + detectMap.confidence)
          textReader.readAsText(file, detectMap.encoding)
        }
      }
      worker.postMessage({ file })
    }
    //* 將文字檔讀取為 ArrayBuffer Type
    arrayBufferReader.readAsArrayBuffer(file)
    event.target.files = null
    event.target.value = ''
  }

  return (
    <div className='upload-button-container'>
      <label htmlFor='file-input-DML' className='file-input-label' id='file-input-label-DML'>Import SQL File</label>
      <input type='file' accept='.sql' id='file-input-DML' className='file-input' data-sql-type='DML' onChange={handleOnChange} />
    </div>
  )
}
