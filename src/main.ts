import 'src/styles.css'
import 'bootstrap/dist/css/bootstrap.css'

const GROUP_AMONT: number = 5
const DEFAULT_GROUP_FIELD_AMOUNT: number = 1

const fieldCountArr: number[] = []

let hasInit = false

const GROUP_SERACH = new Map<string, string[]>([
  [
    '--#PreSQL', ['--#CountSQL', '--#SelectSQL', '--#MainSQL', '--#PostSQL']
  ],
  [
    '--#CountSQL', ['--#SelectSQL', '--#MainSQL', '--#PostSQL']
  ],
  [
    '--#SelectSQL', ['--#MainSQL', '--#PostSQL']
  ],
  [
    '--#MainSQL', ['--#PostSQL']
  ],
  [
    '--#PostSQL', []
  ]
])

const GROUP_TITLE = new Map<string, string>([
  [
    '--#PreSQL', '前置宣告'
  ],
  [
    '--#CountSQL', 'Count語法'
  ],
  [
    '--#SelectSQL', '異動前/後語法'
  ],
  [
    '--#MainSQL', '異動語法'
  ],
  [
    '--#PostSQL', '後置語法'
  ]
])

const SINGLE_COMMAND_INDICATOR = '/*--!*/'

for (let i = 0; i < GROUP_AMONT; i++) {
  fieldCountArr.push(DEFAULT_GROUP_FIELD_AMOUNT)
}

const fileInput: HTMLInputElement = document.getElementById('fileInput') as HTMLInputElement

if (fileInput != null) {
  fileInput.onchange = onFileInput
}

function onFileInput (): void {
  if (fileInput?.files?.length === 0) {
    return
  }
  const reader: FileReader = new FileReader()
  reader.onload = function (event) {
    if (event.target == null) {
      return
    }
    const textFromFileLoaded: string = event.target.result as string
    const textLinesGroupMap: Map<string, string> = getTextGroupMap(textFromFileLoaded)
    const commandGroupMap: Map<string, string[]> = getCommandGroupMap(textLinesGroupMap)
    if (hasInit) {
      resetPageContent()
    }
    createPageContent(commandGroupMap)
    fileInput.files = null
    fileInput.value = ''
    hasInit = true
  }
  if (fileInput.files != null) {
    reader.readAsText(fileInput.files[0], 'UTF-8')
  }
}

function resetPageContent (): void {
  const mainContainer: HTMLDivElement = document.getElementById('center-area') as HTMLDivElement
  const allGroupsContainer: HTMLDivElement = document.getElementById('allGroupsContainer') as HTMLDivElement
  const downloadButtonContainer: HTMLDivElement = document.getElementById('downloadButtonContainer') as HTMLDivElement
  if (mainContainer == null) {
    return
  }
  if (allGroupsContainer != null) {
    mainContainer.removeChild(allGroupsContainer)
  }
  if (downloadButtonContainer != null) {
    mainContainer.removeChild(downloadButtonContainer)
  }
}

function getTextGroupMap (textFromFileLoaded: string): Map<string, string> {
  const textLinesGroupMap: Map<string, string> = new Map<string, string>()
  const textLines: string[] = textFromFileLoaded.split('\n')
  let isGroupToMap = false
  let groupName: string = ''
  for (let i = 0; i < textLines.length; i++) {
    isGroupToMap = false

    //* 若找不到區塊分割的判斷字串，則略過
    groupName = getGroupName(textLines[i])
    if (groupName === '') {
      continue
    }
    const searchEndArr: string[] = GROUP_SERACH.get(groupName) as string[]
    let text = ''

    //* 找到區塊分割的判斷字串後，尋找區塊的結束點
    let j: number
    for (j = i + 1; j < textLines.length; j++) {
      i = j - 1
      for (let k = 0; k < searchEndArr.length; k++) {
        if (textLines[j].trim().startsWith(searchEndArr[k])) {
          //* 找到結束點後，將整個區塊指令儲存至 Map
          textLinesGroupMap.set(groupName, text)
          isGroupToMap = true
          break
        }
      }
      if (isGroupToMap) {
        break
      }
      //* 找到結束點之前，不斷累加該行的指令文字
      text += textLines[j] + '\n'
    }
    //* 如果直到最後都沒有出現結束點文字，則判斷結束點為最後一行文字
    if (j === textLines.length) {
      textLinesGroupMap.set(groupName, text)
      isGroupToMap = true
      break
    }
  }
  return textLinesGroupMap
}

function getCommandGroupMap (textLinesGroupMap: Map<string, string>): Map<string, string[]> {
  const commandGroupMap = new Map<string, string[]>()
  textLinesGroupMap.forEach((text: string, groupName: string) => {
    const textLines = text.split('\n')
    const commamds: string[] = []
    let isAddToMap = false
    for (let i = 0; i < textLines.length; i++) {
      isAddToMap = false
      if (!textLines[i].trim().startsWith(SINGLE_COMMAND_INDICATOR)) {
        continue
      }
      let commandText: string = ''
      const newTextLine: string = textLines[i].replace(SINGLE_COMMAND_INDICATOR, '').trim()
      if (newTextLine.length !== 0) {
        commandText = newTextLine + '\n'
      }
      let j: number
      for (j = i + 1; j < textLines.length; j++) {
        i = j - 1
        if (textLines[j].trim().startsWith(SINGLE_COMMAND_INDICATOR)) {
          commandText = cleanEmptyLineAtCommandEnd(commandText)
          commamds.push(commandText)
          commandGroupMap.set(groupName, commamds)
          isAddToMap = true
          break
        } else {
          commandText += textLines[j].replace(SINGLE_COMMAND_INDICATOR, '') + '\n'
        }
        if (isAddToMap) {
          break
        }
      }
      if (j === textLines.length) {
        commandText = cleanEmptyLineAtCommandEnd(commandText)
        commamds.push(commandText)
        commandGroupMap.set(groupName, commamds)
        isAddToMap = true
        break
      }
    }
  })
  return commandGroupMap
}

function cleanEmptyLineAtCommandEnd (commandText: string): string {
  while (commandText.endsWith('\n')) {
    const i: number = commandText.lastIndexOf('\n')
    commandText = commandText.substring(0, i).trim()
  }
  return commandText;
}

function getGroupName (textLine: string): string {
  const groupNames: string[] = Array.from(GROUP_SERACH.keys())
  for (let i = 0; i < groupNames.length; i++) {
    if (textLine.trim().startsWith(groupNames[i])) {
      return groupNames[i]
    }
  }
  return ''
}

function createPageContent (commandGroupMap: Map<string, string[]>): void {
  const mainContainer: HTMLDivElement = document.getElementById('center-area') as HTMLDivElement
  if (mainContainer == null) {
    return
  }
  const container = document.createElement('div')
  container.id = 'allGroupsContainer'
  container.className = 'container'

  commandGroupMap.forEach((commands, groupName) => {
    createSingleGroupContainer(groupName, commands, container)
  })
  mainContainer.appendChild(container)

  createDownloadButton(mainContainer)
}

function createSingleGroupContainer (groupName: string, commands, parent): void {
  const containerId = groupName.replace('--#', '') + '-container'
  const container = document.createElement('div')
  container.id = containerId
  container.className = 'groupContainer container'

  const title = document.createElement('h3')
  title.innerText = GROUP_TITLE.get(groupName) as string
  container.appendChild(title)

  commands.forEach((cmd: string, index: number) => {
    const paragraph = document.createElement('p')
    paragraph.id = groupName + '_command_' + index
    paragraph.className = 'command'
    paragraph.innerText = cmd
    paragraph.addEventListener('pointerover', () => {
      addClassName(paragraph, 'pointerover-command');
    });
    paragraph.addEventListener('pointerout', () => {
      removeClassName(paragraph, 'pointerover-command');
    });
    container.appendChild(paragraph)
  })

  parent.appendChild(container)
}

function createDownloadButton (parent: HTMLElement): void {
  const container = document.createElement('div')
  container.className = 'container'
  container.id = 'downloadButtonContainer'
  const button = document.createElement('button')
  button.id = 'downloadButton'
  button.textContent = 'Download as XML'
  button.onclick = () => {
    downloadXML()
  }
  container.appendChild(button)
  parent.appendChild(container)
}

function downloadXML (): void {
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xmlContent += '<data>\n'
  fieldCountArr.forEach((count, groupIndex) => {
    xmlContent += '  <group index="' + groupIndex + '">\n'
    for (let i = 0; i < count; i++) {
      // var valueId = 'field' + (groupIndex + 1) + '-' + (i+1)
      // xmlContent += '    <item index="' + i + '">' + document.getElementById(valueId).value + '</item>\n'
    }
    xmlContent += '  </group>\n'
  })
  xmlContent += '</data>\n'

  const blob = new Blob([xmlContent], { type: 'text/xml' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'data.xml'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function addClassName (element: HTMLElement, className: string): void {
  element.className += ' ' + className;
}

function removeClassName (element: HTMLElement, className: string): void {
  element.className = element.className.replace(className, '').trim();
}