const workerFunction = function () {
  self.onmessage = (event: MessageEvent) => {
    const file: File = event.data
    const arrayBufferReader: FileReader = new FileReader()
    arrayBufferReader.onload = (event) => {
      if (event.target == null) {
        return
      }
      const arrayBuffer: ArrayBuffer = event.target.result as ArrayBuffer

      //* 將 ArrayBuffer 轉成 String Type
      const uint8Array: Uint8Array = new Uint8Array(arrayBuffer)
      const binaryString: string = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')
      self.postMessage({ type: 'complete', data: { binaryString } })
    }
    //* 將文字檔讀取為 ArrayBuffer Type
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
const getBinaryString = URL.createObjectURL(blob)

export default getBinaryString
