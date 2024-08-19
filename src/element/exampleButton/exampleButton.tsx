import React from 'react'

interface IExampleButtonProps {
  content: string
  fileName: string
  className: string
  id: string
}

export const ExampleButton: React.FC<IExampleButtonProps> = ({ content, fileName, className, id }) => {
  const handleOnClick = () => {
    const blob = new Blob([content], { type: 'text/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  return (
    <button className={className} id={id} onClick={handleOnClick}>Example</button>
  )
}
