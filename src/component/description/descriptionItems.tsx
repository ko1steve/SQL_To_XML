import React from 'react'

interface IItemListProps {
  className: string
  items: string[]
}

export const DescriptionItems: React.FC<IItemListProps> = ({ className, items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={'descItems-' + index} className={className}>{item}</li>
      ))}
    </ul>
  )
}
