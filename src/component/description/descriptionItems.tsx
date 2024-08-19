import React from 'react'
import * as Config from './config'

interface IItemListProps {
  items: string[]
}

export const DescriptionItems: React.FC<IItemListProps> = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li className={Config.descriptionItemClass} key={index}>{item}</li>
      ))}
    </ul>
  )
}
