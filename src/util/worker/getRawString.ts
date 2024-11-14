interface IGetRawStringMessage {
  file: File
}

export interface IGetRawStringResponse {
  type: string
  data: { rawString: string }
}

const workerFunction = () => {
  self.onmessage = (event: MessageEvent) => {
    const chunkArray = (array: Uint8Array, chunkSize: number) => {
      const result = []
      for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize)
        result.push(chunk)
      }
      return result
    }
    const { file } = event.data as IGetRawStringMessage
    const arrayBufferReader = new FileReader()
    const maxSafeArrayLength = 1000000
    arrayBufferReader.onload = (event) => {
      if (event.target == null) {
        return
      }
      const arrayBuffer = event.target.result as ArrayBuffer
      const uint8Array = new Uint8Array(arrayBuffer)
      const chunkedArray = chunkArray(uint8Array, maxSafeArrayLength)
      const rawString = Array.from(chunkedArray, arr => Array.from(arr, byte => String.fromCharCode(byte)).join('')).join('')
      self.postMessage({ type: 'complete', data: { rawString } })
    }
    arrayBufferReader.readAsArrayBuffer(file)
  }
}

// This stringifies the whole function
const codeToString = workerFunction.toString()
// This brings out the code in the bracket in string
const mainCode = codeToString.substring(codeToString.indexOf('{') + 1, codeToString.lastIndexOf('}'))
// convert the code into a raw data
const blob = new Blob([mainCode], { type: 'application/javascript' })
// A url is made out of the blob object and we're good to go
const GetRawString = URL.createObjectURL(blob)

export default GetRawString
