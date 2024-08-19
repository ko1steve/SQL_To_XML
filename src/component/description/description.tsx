import React from 'react'
import { DescriptionItems } from './descriptionItems'
import * as Content from './content.json'
import * as Config from './config'

export const Description: React.FC = () => {
  const items = Content.items
  return (
    <div className={Config.descriptionContainerClass} id={Config.descriptionContainerId}>
      <div>
        <p className={Config.descriptionTitleClass}>格式說明</p>
      </div>
      <div className={Config.descriptionContentClass}>
        <DescriptionItems items={items} />
      </div>
    </div>
  )
}
