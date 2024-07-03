const workerFunction = function () {
  self.onmessage = (event: MessageEvent) => {
    const { file } = event.data
    const chunkSize: number = 1024 * 1024
    readFileInChunks(file, chunkSize, (offset: number, totalSize: number) => {
      const progress: number = offset + chunkSize > totalSize ? totalSize : offset + chunkSize
      console.log(progress + '/' + totalSize)
    })
  }

  function readFileInChunks (file: File, chunkSize: number, callback: Function): void {
    const arrayBufferReader = new FileReader()
    let offset: number = 0
    let binaryString = ''

    arrayBufferReader.onload = (event) => {
      if (!event.target || event.target.readyState !== FileReader.DONE) {
        return
      }
      const chunkArrayBuffer: ArrayBuffer = event.target.result as ArrayBuffer

      //* 將 ArrayBuffer 轉成 String Type
      let uint8Arrays = splitArrayBuffer(chunkArrayBuffer, chunkSize)
      uint8Arrays.forEach(uint8Arr => {
        binaryString += Array.from(uint8Arr, byte => String.fromCharCode(byte)).join('')
      })
      uint8Arrays = []

      callback(offset, file.size)

      offset += chunkSize
      if (+offset < +file.size) {
        readNextChunk()
      } else {
        self.postMessage({ type: 'complete', data: { binaryString } })
      }
    }

    function readNextChunk () {
      const slice = file.slice(offset, offset + chunkSize)
      arrayBufferReader.readAsArrayBuffer(slice)
    }

    readNextChunk()
  }

  function splitArrayBuffer (buffer: ArrayBuffer, chunkSize: number): Uint8Array[] {
    const result: Uint8Array[] = []
    for (let i: number = 0; i < buffer.byteLength; i += chunkSize) {
      const chunk: ArrayBuffer = buffer.slice(i, i + chunkSize)
      result.push(new Uint8Array(chunk))
    }
    return result
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
