import React from 'react'

export interface ItemListProps {
  items: string[];
}

const DescriptionItems: React.FC<ItemListProps> = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li className='list-text' key={index}>{item}</li>
      ))}
    </ul>
  )
}
export default DescriptionItems
