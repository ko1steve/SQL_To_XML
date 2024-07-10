import React from 'react'

export interface IItemListProps {
  items: string[]
}

const DescriptionItems: React.FC<IItemListProps> = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li className='list-text' key={index}>{item}</li>
      ))}
    </ul>
  )
}
export default DescriptionItems
