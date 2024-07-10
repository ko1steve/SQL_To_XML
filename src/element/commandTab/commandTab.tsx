import React from 'react'
import { CommandType } from 'src/mainConfig'
import { DataModel } from 'src/model/dataModel'
import { Container } from 'typescript-ioc'

interface ICommamdTabProps {
  sqlType: CommandType
  active: boolean
}

export const CommandTab: React.FC<ICommamdTabProps> = ({ sqlType, active }) => {
  const lowerCase = sqlType.toLowerCase()
  const handleOnClick = () => {
    const dataModel = Container.get(DataModel)
    dataModel.currentTab = sqlType
  }
  return (
    <li className='nav-item' role='presentation'>
      <button className={`nav-link ${(active ? 'active' : '')}`} id={`${lowerCase}-tab`} data-bs-toggle='tab' data-bs-target={`#${lowerCase}`} type='button'
        role='tab' aria-controls={`${lowerCase}`} aria-selected={`${(active ? 'true' : 'false')}`} onClick={handleOnClick}>{sqlType}</button>
    </li>
  )
}
