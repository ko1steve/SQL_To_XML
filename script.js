var GROUP_AMONT = 5;
var DEFAULT_GROUP_FIELD_AMOUNT = 1;

var fieldCountArr = []

for (i = 0; i < GROUP_AMONT; i++) {
    fieldCountArr.push(DEFAULT_GROUP_FIELD_AMOUNT);
}

function downloadXML() {
    // Create XML content
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

    // Create Blob and download
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