import React from 'react'
import { ExampleButton } from 'src/element/exampleButton/exampleButton'
import * as Config from './config'

export const Header: React.FC = () => {
  return (
    <div className={Config.backgroundClass}>
      <div className={Config.titleContainerClass}>
        <span id={Config.titleId}>SQL 產生器</span>
        <div className={Config.buttonListContainerClass}>
          <ul className={Config.buttonListClass}>
            <li className={Config.buttonListItemClass}>
              <ExampleButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
