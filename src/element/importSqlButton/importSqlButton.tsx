import React from 'react'
import getBinaryString from 'src/util/worker/getBinaryString'
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
    const overlay = document.getElementById('overlay') as HTMLDivElement
    overlay.style.display = 'flex'

    const worker = new Worker(getBinaryString)

    worker.onmessage = (event: any) => {
      const { type, data } = event.data
      if (type === 'progress') {
        //
      } else if (type === 'complete') {
        worker.terminate()
        const dataModel = Container.get(DataModel)

        //* 偵測文字編碼
        const { binaryString } = data
        const encoding: string = jschardet.detect(binaryString).encoding

        const textReader = new FileReader()
        textReader.onload = (event) => {
          if (event.target == null) {
            return
          }
          const text = event.target.result as string
          if (dataModel.tabContentControllerMap.has(dataModel.currentTab)) {
            const tabContentController = dataModel.tabContentControllerMap.get(dataModel.currentTab)
            tabContentController.resetPageContent(text, file.name)
          } else {
            const tabContentController = new SqlContentController(dataModel.currentTab, text, file.name)
            dataModel.tabContentControllerMap.set(dataModel.currentTab, tabContentController)
          }
        }
        //* 以偵測到的編碼讀取文字檔
        console.log('encoding : ' + encoding)
        textReader.readAsText(file, encoding)
      }
    }
    worker.postMessage(file.slice(0, 1024))

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
