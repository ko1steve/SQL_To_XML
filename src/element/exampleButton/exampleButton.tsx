import React from 'react'

export const ExampleButton: React.FC = () => {
  const handleOnClick = () => {
    const xmlContent = '--#PreSQL' + '\r\n' +
      '--請放置前置語法' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'SET CONTEXT_INFO 0x12345678' + '\r\n' +
      '\r\n' +
      '--#PreProdSQL' + '\r\n' +
      '--請放置PreProd前置語法' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'SET CONTEXT_INFO 0x12345678' + '\r\n' +
      '\r\n' +
      '--#CountSQL' + '\r\n' +
      '--請放置Count語法' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'SELECT COUNT(*) FROM EASY.TEST1' + '\r\n' +
      '\r\n' +
      '--#SelectSQL' + '\r\n' +
      '--請放置異動前/後語法' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'SELECT * FROM EASY.TEST1 WHERE ID=1' + '\r\n' +
      '\r\n' +
      '--#MainSQL' + '\r\n' +
      '--請放置異動語法' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'INSERT INTO EASY.TEST1(ID,NAME) VALUES(101,Easy)' + '\r\n' +
      '\r\n' +
      '--#PostSQL' + '\r\n' +
      '--請放置後置語法' + '\r\n' +
      '/*--!*/' + '\r\n' +
      'SET CONTEXT_INFO 0x0'

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
