import React from 'react'

export const ExampleButton: React.FC = () => {
  const handleOnClick = () => {
    const xmlContent = '--#PreSQL' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'Create table #temp_table' + '\r\n' +
      '\r\n' +
      '--#PreProdSQL' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'Drop Index TestIdx' + '\r\n' +
      '\r\n' +
      '--#CountSQL' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'SELECT COUNT(*) FROM EASY.TEST1' + '\r\n' +
      '\r\n' +
      '--#SelectSQL' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'SELECT * FROM EASY.TEST1 WHERE ID=1' + '\r\n' +
      '\r\n' +
      '--#MainSQL' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'INSERT INTO EASY.TEST1(ID,NAME) VALUES(101,Easy)' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'INSERT INTO EASY.TEST1(ID,NAME) VALUES(102,Easy)' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'INSERT INTO EASY.TEST1(ID,NAME) VALUES(103,Easy)' + '\r\n' +
      '\r\n' +
      '--#PostSQL' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'Drop table #temp_table'

    const blob = new Blob([xmlContent], { type: 'text/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'example.sql'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  return (
    <button className='nav-link py-2 px-0 px-lg-2 header-bar' id='download-example-button' onClick={handleOnClick}>Example</button>
  )
}
