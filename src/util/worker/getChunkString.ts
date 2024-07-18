interface IGetChunckStringData {
  chunkFile: File
  isAllRead: boolean
  intactLine: boolean
  prevChunkString: string
}

const workerFunction = function () {
  self.onmessage = (event: MessageEvent) => {
    const { chunkFile, isAllRead, intactLine, prevChunkString }: IGetChunckStringData = event.data
    const arrayBufferReader: FileReader = new FileReader()
    arrayBufferReader.onload = (event) => {
      if (event.target == null) {
        return
      }
      const arrayBuffer: ArrayBuffer = event.target.result as ArrayBuffer

      //* 將 ArrayBuffer 轉成 String Type
      const uint8Array: Uint8Array = new Uint8Array(arrayBuffer)
      let chunkString: string = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')
      if (prevChunkString != null) {
        chunkString = prevChunkString + chunkString
      }
      if (!intactLine || isAllRead) {
        return self.postMessage({ type: 'complete', data: { chunkString } })
      }
      const chunkStringArr = chunkString.split(/\r\n/)
      if (chunkStringArr.length > 1) {
        return self.postMessage({ type: 'complete', data: { chunkString: chunkStringArr[0] } })
      }
      self.postMessage({ type: 'update', data: { chunkString } })
    }
    //* 將文字檔讀取為 ArrayBuffer Type
    arrayBufferReader.readAsArrayBuffer(chunkFile)
  }
}

// This stringifies the whole function
const codeToString = workerFunction.toString()
// This brings out the code in the bracket in string
const mainCode = codeToString.substring(codeToString.indexOf('{') + 1, codeToString.lastIndexOf('}'))
// convert the code into a raw data
const blob = new Blob([mainCode], { type: 'application/javascript' })
// A url is made out of the blob object and we're good to go
const getChunkString = URL.createObjectURL(blob)

export default getChunkString
