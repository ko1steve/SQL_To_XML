import React from 'react'

interface ISqlTypeTabProps {
  sqlType: string
  active: boolean
}

const SqlTypeTab: React.FC<ISqlTypeTabProps> = ({ sqlType, active }) => {
  const lowerCase = sqlType.toLowerCase()
  return (
    <li className='nav-item' role='presentation'>
      <button className={`nav-link ${(active ? 'active' : '')}`} id={`${lowerCase}-tab`} data-bs-toggle='tab' data-bs-target={`#${lowerCase}`} type='button'
        role='tab' aria-controls={`${lowerCase}`} aria-selected={`${(active ? 'true' : 'false')}`}>{sqlType}</button>
    </li>
  )
}

export default SqlTypeTab
