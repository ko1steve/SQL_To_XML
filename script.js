function downloadXML() {
    // Get values from input fields
    var field1Value = document.getElementById('field1').value;
    var field2Value = document.getElementById('field2').value;
    var field3Value = document.getElementById('field3').value;
    var field4Value = document.getElementById('field4').value;
    var field5Value = document.getElementById('field5').value;

    // Create XML content
    var xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlContent += '<data>\n';
    xmlContent += '  <field1>' + field1Value + '</field1>\n';
    xmlContent += '  <field2>' + field2Value + '</field2>\n';
    xmlContent += '  <field3>' + field3Value + '</field3>\n';
    xmlContent += '  <field4>' + field4Value + '</field4>\n';
    xmlContent += '  <field5>' + field4Value + '</field5>\n';
    xmlContent += '</data>';

    // Create Blob and download
    var blob = new Blob([xmlContent], { type: 'text/xml' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}