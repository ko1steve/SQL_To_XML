import React from 'react'
import { DescriptionItems } from './descriptionItems'
import * as Content from './content.json'
import * as Config from './config'

export const Description: React.FC = () => {
  const items = Content.items
  return (
    <div className={Config.descriptionContainer.className} id={Config.descriptionContainer.id}>
      <div>
        <p className={Config.descriptionTitle.className}>格式說明</p>
      </div>
      <div className={Config.descriptionContent.className}>
        <DescriptionItems className={Config.descriptionItem.className} items={items} />
      </div>
    </div>
  )
}
