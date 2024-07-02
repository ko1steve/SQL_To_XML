const workerFunction = function () {
  // we perform every operation we want in this function right here
  self.onmessage = (event: MessageEvent) => {
    const { file, chunkSize } = event.data
    const reader = new FileReader()
    let offset = 0
    let binaryString = ''

    reader.onload = (event) => {
      if (!event.target || event.target.readyState !== FileReader.DONE) {
        return
      }
      const chunkArrayBuffer = event.target.result as ArrayBuffer
      const chunkUint8Array = new Uint8Array(chunkArrayBuffer)
      binaryString += String.fromCharCode.apply(null, chunkUint8Array as unknown as number[])

      // Send progress back to the main thread
      self.postMessage({ type: 'progress', data: { offset, totalSize: file.size } })

      offset += chunkSize
      if (offset < file.size) {
        readNextChunk()
      } else {
        readFinalChunk(binaryString)
      }
    }

    function readNextChunk () {
      const slice = file.slice(offset, offset + chunkSize)
      reader.readAsArrayBuffer(slice)
    }

    function readFinalChunk (binaryString: string) {
      const text = binaryString
      self.postMessage({ type: 'finalChunk', data: { text } })
    }

    readNextChunk()
  }
}

// This stringifies the whole function
const codeToString = workerFunction.toString()
// This brings out the code in the bracket in string
const mainCode = codeToString.substring(codeToString.indexOf('{') + 1, codeToString.lastIndexOf('}'))
// convert the code into a raw data
const blob = new Blob([mainCode], { type: 'application/javascript' })
// A url is made out of the blob object and we're good to go
const readFileChunkScript = URL.createObjectURL(blob)

export default readFileChunkScript
