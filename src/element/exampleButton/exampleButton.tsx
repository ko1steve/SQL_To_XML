import React from 'react'
import * as Content from './content.json'

export const ExampleButton: React.FC = () => {
  const handleOnClick = () => {
    const xmlContent = Content.xmlContentStrings.join('')
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
