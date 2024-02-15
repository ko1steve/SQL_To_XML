var GROUP_AMONT = 5;
var DEFAULT_GROUP_FIELD_AMOUNT = 1;

var fieldCountArr = []

var groupArr = [];

const GROUP_SERACH = new Map([
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

const GROUP_TITLE = new Map ([
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

for (i = 0; i < GROUP_AMONT; i++) {
    fieldCountArr.push(DEFAULT_GROUP_FIELD_AMOUNT);
}

function onFileInput () {
    var fileInput = document.getElementById('fileInput').files[0];
    var reader = new FileReader();
    reader.onload = function(event){
        var textFromFileLoaded = event.target.result;
        var textGroupMap = getTextGroupMap(textFromFileLoaded);
        createPageContent(textGroupMap);
    };
    reader.readAsText(fileInput, 'UTF-8');
}

function getTextGroupMap (textFromFileLoaded) {
    var textGroupMap = new Map();
    var textLines = textFromFileLoaded.split('\n');
    var isGroupToMap = false;
    var groupName = '';
    for (var i = 0; i < textLines.length; i++) {
        textLines[i] = textLines[i].trim();
        var text = textLines[i] + '\n';
        isGroupToMap = false;

        //* 若找不到區塊分割的判斷字串，則略過
        groupName = getGroupName(textLines[i]);
        if (!groupName) {
            continue;
        }

        //*找到區塊分割的判斷字串後，尋找區塊的結束點
        var j;
        for (j = i + 1; j < textLines.length; j++) {
            i = j - 1;
            var searchEndArr = GROUP_SERACH.get(groupName);
            for (var k = 0; k < searchEndArr.length; k++) {
                if (textLines[j].startsWith(searchEndArr[k])) {
                    //* 找到結束點後，將整個區塊指令儲存至 Map
                    textGroupMap.set(groupName, text);
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
            textGroupMap.set(groupName, text);
            isGroupToMap = true;
            break;
        }
    }
    return textGroupMap;
}

function getGroupName (text) {
    var groupNames = Array.from(GROUP_SERACH.keys());
    for (let i = 0; i < groupNames.length; i++) {
        if (text.startsWith(groupNames[i])) {
            return groupNames[i];
        }
    }
    return null;
}

function createPageContent (textGroupMap) {
    var mainContainer = document.getElementById('mainContainer');

    var container = document.createElement('div');
    container.id = 'allGroupsContainer';
    container.className = 'container';

    textGroupMap.forEach((text, groupName)=>{
        createSingleGroupContainer(groupName, text, container);
    });
    mainContainer.appendChild(container);

    createDownloadButton(mainContainer);
}

function createSingleGroupContainer (groupName, text, parent) {
    var containerId = groupName.replace('--#', '')  + '-container';
    var container = document.createElement('div');
    container.id = containerId;
    container.className = 'groupContainer container';

    var title = document.createElement('h3');
    title.innerText = GROUP_TITLE.get(groupName);
    container.appendChild(title);

    var paragraph = document.createElement('p');
    paragraph.className = 'command';
    paragraph.innerText = text;
    container.appendChild(paragraph);

    parent.appendChild(container);
}

function createDownloadButton (parent) {
    var container = document.createElement('div');
    container.className = 'container';
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
            xmlContent += '    <item index="' + i + '">' + document.getElementById(valueId).value + '</item>\n';
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

function fieldAdd(fieldNum) {
    fieldCountArr[fieldNum-1] += 1;

    var container = document.getElementById('fieldAdd' + fieldNum + 'Container');

    var fieldContainer = document.createElement('div');
    fieldContainer.className = 'container';
    fieldContainer.id = 'field' + fieldNum + '-' + fieldCountArr[fieldNum-1] + 'Container';
    container.appendChild(fieldContainer);

    var label = document.createElement('label');
    label.for = 'field' + fieldNum + '-' + fieldCountArr[fieldNum-1];
    label.textContent = '語法：';
    fieldContainer.appendChild(label);

    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'field' + fieldNum + '-' + fieldCountArr[fieldNum-1];
    fieldContainer.appendChild(input);
}