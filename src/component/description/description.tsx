import React from 'react'
import DescriptionItems from './descriptionItems'
import * as Content from './content.json'

const Description: React.FC = () => {
  const items = Content.items
  return (
    <div className='col-4 container' id='descript-container'>
      <div>
        <p className='h2 d-flex justify-content-center' id='description-title'>格式說明</p>
      </div>
      <div className='d-flex justify-content-center' id='description-content'>
        <DescriptionItems items={items} />
      </div>
    </div>
  )
}

export default Description
