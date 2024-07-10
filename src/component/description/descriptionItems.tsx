import React from 'react'

interface IItemListProps {
  items: string[]
}

export const DescriptionItems: React.FC<IItemListProps> = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li className='list-text' key={index}>{item}</li>
      ))}
    </ul>
  )
}
