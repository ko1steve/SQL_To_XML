import React from 'react'
import GetRawString, { IGetRawStringResponse } from 'src/util/worker/getRawString'
import jschardet from 'jschardet'
import { Container } from 'typescript-ioc'
import { DataModel } from 'src/model/dataModel'
import { Common } from 'src/util/common'

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
    const file = event.target.files[0]
    const arrayBufferReader = new FileReader()
    const worker = new Worker(GetRawString)

    const dataModel = Container.get(DataModel)
    dataModel.onStartLoadSignal.dispatch()

    arrayBufferReader.onload = (event) => {
      if (event.target == null) {
        return
      }
      worker.onmessage = (event: any) => {
        const { type, data } = event.data as IGetRawStringResponse
        if (type === 'complete') {
          const detectMap = jschardet.detect(data.rawString)
          const textReader = new FileReader()
          textReader.onload = (event) => {
            const dataModel = Container.get(DataModel)
            if (event.target == null) {
              return
            }
            const textFromFileLoaded = event.target.result as string
            if (dataModel.tabContentControllerMap.has(dataModel.currentTab)) {
              dataModel.fileName = file.name
              dataModel.onTextFromFileLoadedChangeSignal.dispatch({ textFromFileLoaded, commandType: dataModel.currentTab })
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
    event.target.value = Common.EmptyString
  }

  return (
    <div className={className} id={id}>
      <label htmlFor={input.id} className={label.className} id={label.id}>Import SQL File</label>
      <input type='file' accept='.sql' className={input.className} id={input.id} onChange={handleOnChange} />
    </div>
  )
}
