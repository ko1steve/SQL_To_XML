import 'src/styles.css'

const GROUP_AMONT: number = 5;
const DEFAULT_GROUP_FIELD_AMOUNT: number = 1;

let fieldCountArr: Array<number> = []
var groupArr = [];

var hasInit = false;

const GROUP_SERACH = new Map<string, Array<string>> ([
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
]);

const GROUP_TITLE = new Map<string, string> ([
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
]);

const SINGLE_COMMAND_INDICATOR = '/*--!*/';

for (let i = 0; i < GROUP_AMONT; i++) {
    fieldCountArr.push(DEFAULT_GROUP_FIELD_AMOUNT);
}

document.getElementById('fileInput').onchange = onFileInput;

function onFileInput ():void {
    let fileInput: HTMLInputElement = document.getElementById('fileInput') as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(event){
        if (!event.target) {
            return;
        }
        var textFromFileLoaded = event.target.result;
        var textLinesGroupMap = getTextGroupMap(textFromFileLoaded);
        var commandGroupMap = getCommandGroupMap(textLinesGroupMap);
        if (hasInit) {
            resetPageContent();
        }
        createPageContent(commandGroupMap);
        fileInput.files = null;
        fileInput.value = '';
        hasInit = true;
    };
    reader.readAsText(fileInput.files[0], 'UTF-8');
}

function resetPageContent () {
    let mainContainer = document.getElementById('mainContainer');
    let allGroupsContainer = document.getElementById('allGroupsContainer');
    let downloadButtonContainer = document.getElementById('downloadButtonContainer');
    if (!mainContainer) {
        return;
    }
    if (allGroupsContainer) {
        mainContainer.removeChild(allGroupsContainer);
    }
    if (downloadButtonContainer) {
        mainContainer.removeChild(downloadButtonContainer);
    }
}

function getTextGroupMap (textFromFileLoaded) {
    var textLinesGroupMap = new Map();
    var textLines = textFromFileLoaded.split('\n');
    var isGroupToMap = false;
    let groupName: string = '';
    for (var i = 0; i < textLines.length; i++) {
        isGroupToMap = false;

        //* 若找不到區塊分割的判斷字串，則略過
        groupName = getGroupName(textLines[i]);
        if (!groupName) {
            continue;
        }
        let searchEndArr: string[] = GROUP_SERACH.get(groupName) as Array<string>;
        var text = '';

        //*找到區塊分割的判斷字串後，尋找區塊的結束點
        var j;
        for (j = i + 1; j < textLines.length; j++) {
            i = j - 1;
            for (var k = 0; k < searchEndArr.length; k++) {
                if (textLines[j].trim().startsWith(searchEndArr[k])) {
                    //* 找到結束點後，將整個區塊指令儲存至 Map
                    textLinesGroupMap.set(groupName, text);
                    isGroupToMap = true;
                    break;
                }
            }
            if (isGroupToMap) {
                break;
            }
            //* 找到結束點之前，不斷累加該行的指令文字
            text += textLines[j] + '\n';
        }
        //* 如果直到最後都沒有出現結束點文字，則判斷結束點為最後一行文字
        if (j == textLines.length) {
            textLinesGroupMap.set(groupName, text);
            isGroupToMap = true;
            break;
        }
    }
    return textLinesGroupMap;
}

function getCommandGroupMap (textLinesGroupMap) {
    var commandGroupMap = new Map();
    textLinesGroupMap.forEach((text, groupName)=>{
        var textLines = text.split('\n');
        var commamds: Array<string> = [];
        var commandText = '';
        var isAddToMap = false;
        for (var i = 0; i < textLines.length; i++) {
            isAddToMap = false;
            if (!textLines[i].trim().startsWith(SINGLE_COMMAND_INDICATOR)) {
                continue;
            }
            let commandText: string = '';
            var newTextLine = textLines[i].replace(SINGLE_COMMAND_INDICATOR, '').trim();
            if (newTextLine.length != 0) {
                commandText = newTextLine + '\n';
            }
            var j;
            for (j = i + 1; j < textLines.length; j++) { 
                i = j - 1;
                if (textLines[j].trim().startsWith(SINGLE_COMMAND_INDICATOR)){
                    commamds.push(commandText);
                    commandGroupMap.set(groupName, commamds);
                    isAddToMap = true;
                    break;
                } else {
                    commandText += textLines[j].replace(SINGLE_COMMAND_INDICATOR, '') + '\n';
                }
                if (isAddToMap) {
                    break;
                }
            }
            if (j == textLines.length) {
                commamds.push(commandText);
                commandGroupMap.set(groupName, commamds);
                isAddToMap = true;
                break;
            }
        }
    });
    return commandGroupMap;
}

function getGroupName (textLine: string): string {
    var groupNames = Array.from(GROUP_SERACH.keys());
    for (let i = 0; i < groupNames.length; i++) {
        if (textLine.trim().startsWith(groupNames[i])) {
            return groupNames[i];
        }
    }
    return '';
}

function createPageContent (commandGroupMap: Map<string, Array<string>>) {
    let mainContainer = document.getElementById('mainContainer');
    if (!mainContainer) {
        return;
    }
    let container = document.createElement('div');
    container.id = 'allGroupsContainer';
    container.className = 'container';

    commandGroupMap.forEach((commands, groupName)=>{
        createSingleGroupContainer(groupName, commands, container);
    });
    mainContainer.appendChild(container);

    createDownloadButton(mainContainer);
}

function createSingleGroupContainer (groupName, commands, parent) {
    let containerId = groupName.replace('--#', '')  + '-container';
    let container = document.createElement('div');
    container.id = containerId;
    container.className = 'groupContainer container';

    let title = document.createElement('h3');
    title.innerText = GROUP_TITLE.get(groupName) as string;
    container.appendChild(title);

    commands.forEach( (cmd, index) => {
        let paragraph = document.createElement('p');
        paragraph.id = groupName + '_command_' + index;
        paragraph.className = 'command';
        paragraph.innerText = cmd;
        container.appendChild(paragraph);
    });

    parent.appendChild(container);
}

function createDownloadButton (parent) {
    var container = document.createElement('div');
    container.className = 'container';
    container.id = 'downloadButtonContainer';
    var button = document.createElement('button');
    button.id = 'downloadButton';
    button.textContent = 'Download as XML';
    button.onclick = ()=>{
        downloadXML();
    };
    container.appendChild(button);
    parent.appendChild(container);
}

function downloadXML() {
    var xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<data>\n';
    fieldCountArr.forEach((count, groupIndex)=>{
        xmlContent += '  <group index="' + groupIndex + '">\n'
        for(var i = 0; i < count; i++) {
            var valueId = 'field' + (groupIndex + 1) + '-' + (i+1);
            // xmlContent += '    <item index="' + i + '">' + document.getElementById(valueId).value + '</item>\n';
        }
        xmlContent += '  </group>\n'
    });
    xmlContent += '</data>\n';

    var blob = new Blob([xmlContent], { type: 'text/xml' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}