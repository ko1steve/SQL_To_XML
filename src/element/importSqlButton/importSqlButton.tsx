import React from 'react'
import GetRawString, { IGetRawStringResponse } from 'src/util/worker/getRawString'
import jschardet from 'jschardet'
import { Container } from 'typescript-ioc'
import { DataModel } from 'src/model/dataModel'
import { SqlContentController } from 'src/core/sqlContent/sqlContentController'

interface IImportSqlButtonProps {
  className: string
  id: string
  label: {
    className: string
    id: string
  }
  input: {
    className: string
    id: string
  }
}

export const ImportSqlButton: React.FC<IImportSqlButtonProps> = ({ className, id, label, input }) => {
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
          console.log('encoding : ' + detectMap.encoding)
          if (!['Big5', 'ascii', 'UTF-8'].includes(detectMap.encoding)) {
            detectMap.encoding = 'Big5'
            console.log('(fixed) encoding : ' + detectMap.encoding)
          }
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
    <div className={className} id={id}>
      <label htmlFor={input.id} className={label.className} id={label.id}>Import SQL File</label>
      <input type='file' accept='.sql' className={input.className} id={input.id} onChange={handleOnChange} />
    </div>
  )
}
