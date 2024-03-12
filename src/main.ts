import 'src/styles.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import { GroupName, IElementConifg, IGroupSetting, IMainConfig, ISingleGroupContainerConfig, MainConfig, SqlType } from './config'

const mainConfig: IMainConfig = new MainConfig();

const hasInitMap: Map<SqlType, boolean> = new Map([
  [SqlType.DML, false],
  [SqlType.DDL, false]
])

let commandGroupMap: Map<GroupName, CommandData[]>

const fileInputDdl: HTMLInputElement = document.getElementById('fileInput-DDL') as HTMLInputElement
const fileInputDml: HTMLInputElement = document.getElementById('fileInput-DML') as HTMLInputElement

if (fileInputDdl != null) {
  fileInputDdl.onchange = onFileInput.bind(this, fileInputDdl)
}
if (fileInputDml != null) {
  fileInputDml.onchange = onFileInput.bind(this, fileInputDml)
}

function onFileInput(fileInput: HTMLInputElement): void {
  if (fileInput?.files?.length === 0) {
    return
  }
  let sqlType: SqlType = SqlType.NONE;
  Object.values(SqlType).forEach(e => {
    if (e.toString() === fileInput.dataset.sqlType) {
      sqlType = e
    }
  })
  if (sqlType == SqlType.NONE) {
    return
  }
  const elementConfig: IElementConifg = mainConfig.elementConfigMap.get(sqlType) as IElementConifg
  console.error(sqlType, elementConfig);

  const reader: FileReader = new FileReader()
  reader.onload = function (event) {
    if (event.target == null) {
      return
    }
    const textFromFileLoaded: string = event.target.result as string
    const textLinesGroupMap: Map<string, string> = getTextGroupMap(textFromFileLoaded)
    commandGroupMap = getCommandGroupMap(textLinesGroupMap)
    if (hasInitMap.has(sqlType) && hasInitMap.get(sqlType)) {
      resetPageContent(elementConfig, sqlType)
    }
    createPageContent(commandGroupMap, elementConfig, sqlType)
    fileInput.files = null
    fileInput.value = ''
    hasInitMap.set(sqlType, true)
  }
  if (fileInput.files != null) {
    reader.readAsText(fileInput.files[0], 'UTF-8')
  }
}

function resetPageContent(elementConfig: IElementConifg, sqlType: SqlType): void {
  const centerArea: HTMLDivElement = document.getElementById('center-area-' + sqlType) as HTMLDivElement
  const allGroupsContainer: HTMLDivElement = document.getElementById(elementConfig.allGroupsContainer.id) as HTMLDivElement
  const downloadButtonContainer: HTMLDivElement = document.getElementById('downloadButtonContainer') as HTMLDivElement
  if (centerArea == null) {
    return
  }
  if (allGroupsContainer != null) {
    centerArea.removeChild(allGroupsContainer)
  }
  if (downloadButtonContainer != null) {
    centerArea.removeChild(downloadButtonContainer)
  }
}

function getTextGroupMap(textFromFileLoaded: string): Map<string, string> {
  const textLinesGroupMap: Map<string, string> = new Map<string, string>()
  const textLines: string[] = textFromFileLoaded.split('\n')
  let isGroupToMap = false
  let groupName: GroupName | null
  for (let i = 0; i < textLines.length; i++) {
    isGroupToMap = false

    //* 若找不到區塊分割的判斷字串，則略過
    groupName = getGroupName(textLines[i])
    if (groupName === null) {
      continue
    }
    const searchEndArr: string[] = mainConfig.groupSettingMap.get(groupName)?.searchEndPattern as string[]
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

function isIgnoreCommand(text: string) {
  text = text.trim()
  if (text.endsWith(';')) {
    text = text.substring(0, text.length - 1)
  }
  return mainConfig.ignoredCommands.includes(text.toUpperCase())
}

function isValidCommand(text: string): boolean {
  text = text.trim()
  if (text.endsWith(';')) {
    text = text.substring(0, text.length - 1)
  }
  let result = true
  mainConfig.invalidCommands.forEach(e => {
    if (text.toUpperCase().indexOf(e) > -1) {
      result = false
    }
  })
  return result
}

function getCommandGroupMap(textLinesGroupMap: Map<string, string>): Map<GroupName, CommandData[]> {
  const commandGroupMap = new Map<GroupName, CommandData[]>()
  textLinesGroupMap.forEach((text: string, groupName: GroupName) => {
    const textLines = text.split('\n')
    const commamds: CommandData[] = []
    for (let i = 0; i < textLines.length; i++) {
      let isAddToMap = false
      let isCommandValid = true;

      //* 若找不到指令分割的判斷字串，則略過
      if (!textLines[i].trim().startsWith(mainConfig.singleCommandIndicator)) {
        continue
      }
      let commandText: string = ''
      const newTextLine: string = textLines[i].replace(mainConfig.singleCommandIndicator, '').trim()

      //* 判斷指令是不是該忽略 
      if (newTextLine.length !== 0 && !isIgnoreCommand(newTextLine)) {
        isCommandValid = isValidCommand(newTextLine)
        commandText = newTextLine + '\n'
      }
      //* 找到指令分割的判斷字串後，尋找指令的結束點
      let j: number
      for (j = i + 1; j < textLines.length; j++) {
        i = j - 1
        if (textLines[j].trim().startsWith(mainConfig.singleCommandIndicator)) {
          commandText = cleanEmptyLineAtCommandEnd(commandText)
          if (commandText.length > 0) {
            const commandStatus: CommandStatus = isCommandValid ? CommandStatus.valid : CommandStatus.invalid
            commamds.push(new CommandData(commandText, commandStatus))
            commandGroupMap.set(groupName, commamds)
          }
          isAddToMap = true
          break
        } else if (!isIgnoreCommand(textLines[j])) {
          textLines[j] = textLines[j].replace(mainConfig.singleCommandIndicator, '')
          if (textLines[j].trim().length > 0) {
            isCommandValid = isValidCommand(textLines[j])
            //* 找到結束點之前，不斷累加指令的內容
            commandText += textLines[j] + '\n'
          }
        }
        if (isAddToMap) {
          break
        }
      }
      //* 如果直到最後都沒有出現結束點文字，則判斷結束點為最後一行文字
      if (j === textLines.length) {
        commandText = cleanEmptyLineAtCommandEnd(commandText)
        if (commandText.length > 0) {
          const commandStatus: CommandStatus = isCommandValid ? CommandStatus.valid : CommandStatus.invalid
          commamds.push(new CommandData(commandText, commandStatus))
          commandGroupMap.set(groupName, commamds)
        }
        isAddToMap = true
        break
      }
    }
  })
  return commandGroupMap
}

function cleanEmptyLineAtCommandEnd(commandText: string): string {
  while (commandText.endsWith('\n')) {
    const i: number = commandText.lastIndexOf('\n')
    commandText = commandText.substring(0, i).trim()
  }
  return commandText;
}

function getGroupName(textLine: string): GroupName | null {
  const groupNames: GroupName[] = Array.from(mainConfig.groupSettingMap.keys())
  const groupSetting: IGroupSetting[] = Array.from(mainConfig.groupSettingMap.values())
  for (let i = 0; i < groupSetting.length; i++) {
    if (textLine.trim().startsWith(groupSetting[i].indicator)) {
      return groupNames[i]
    }
  }
  return null
}

function createPageContent(commandGroupMap: Map<GroupName, CommandData[]>, elementConfig: IElementConifg, sqlType: SqlType): void {
  const centerArea: HTMLDivElement = document.getElementById('center-area-' + sqlType) as HTMLDivElement
  if (centerArea == null) {
    return
  }
  const config = elementConfig.allGroupsContainer
  const container = document.createElement('div')
  container.id = config.id
  container.className = config.className

  commandGroupMap.forEach((commands, groupName) => {
    createSingleGroupContainer(groupName, commands, container, elementConfig)
  })
  centerArea.appendChild(container)

  createDownloadButton(centerArea)
}

function createSingleGroupContainer(groupName: GroupName, commands: CommandData[], parent: HTMLElement, elementConfig: IElementConifg): void {
  const config: ISingleGroupContainerConfig = elementConfig.allGroupsContainer.singleGroupContainerConfig;

  const container = document.createElement('div')
  container.className = config.className

  const title = document.createElement('p')
  title.id = config.title.id.replace('{groupName}', groupName)
  title.className = config.title.className
  title.innerText = mainConfig.groupSettingMap.get(groupName)?.title as string
  container.appendChild(title)

  const orderedList = document.createElement('ol')
  container.appendChild(orderedList)

  commands.forEach((command: CommandData, index: number) => {
    const listItem = document.createElement('li')
    listItem.dataset.groupName = groupName
    listItem.dataset.index = index.toString()
    if (command.status === CommandStatus.invalid) {
      addClassName(listItem, 'command-invalid')
    }
    listItem.addEventListener('pointerover', () => {
      addClassName(listItem, 'pointerover-command')
    });
    listItem.addEventListener('pointerout', () => {
      removeClassName(listItem, 'pointerover-command')
    });
    orderedList.appendChild(listItem)

    const paragraph = document.createElement('p')
    paragraph.id = config.paragraph.id.replace('{groupName}', groupName).replace('{index}', index.toString())
    paragraph.className = config.paragraph.className
    paragraph.innerText = command.content
    listItem.appendChild(paragraph)
  })
  parent.appendChild(container)
}

function createDownloadButton(parent: HTMLElement): void {
  const container = document.createElement('div')
  container.id = 'downloadButtonContainer'
  container.className = 'container'
  const button = document.createElement('button')
  button.className = 'downloadButton'
  button.textContent = 'Download as XML'
  button.onclick = () => {
    // downloadXML()
  }
  container.appendChild(button)
  parent.appendChild(container)
}

// function downloadXML (): void {
//   let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n'
//   xmlContent += '<data>\n'
//   fieldCountArr.forEach((count, groupIndex) => {
//     xmlContent += '  <group index="' + groupIndex + '">\n'
//     for (let i = 0; i < count; i++) {
//       // var valueId = 'field' + (groupIndex + 1) + '-' + (i+1)
//       // xmlContent += '    <item index="' + i + '">' + document.getElementById(valueId).value + '</item>\n'
//     }
//     xmlContent += '  </group>\n'
//   })
//   xmlContent += '</data>\n'

//   const blob = new Blob([xmlContent], { type: 'text/xml' })
//   const a = document.createElement('a')
//   a.href = URL.createObjectURL(blob)
//   a.download = 'data.xml'
//   document.body.appendChild(a)
//   a.click()
//   document.body.removeChild(a)
// }

function addClassName(element: HTMLElement, ...classNames: string[]): void {
  classNames.forEach(className => element.className += ' ' + className)
}

function removeClassName(element: HTMLElement, ...classNames: string[]): void {
  classNames.forEach(className => element.className = element.className.replace(className, '').trim())
}

enum CommandStatus {
  valid = 'valid',
  invalid = 'invalid',
  ignored = 'ignored'
}

interface ICommandData {
  content: string
  status: CommandStatus
}

class CommandData implements ICommandData {

  protected _content: string;
  protected _status: CommandStatus;

  constructor(content: string, status = CommandStatus.valid) {
    this._content = content;
    this._status = status;
  }

  public get content(): string {
    return this._content
  }

  public get status(): CommandStatus {
    return this._status
  }
}