import React from 'react'
import { ExampleButton } from '../../element/exampleButton/exampleButton'
import * as Config from './config'
import * as ExampleContent from './exampleContent.json'
import { Common } from '../../util/common'

export const Header: React.FC = () => {
  const content = ExampleContent.content.join(Common.EmptyString)
  return (
    <div className={Config.background.className}>
      <div className={Config.titleContainer.className}>
        <span id={Config.title.id}>SQL 產生器</span>
        <div className={Config.buttonListContainer.className}>
          <ul className={Config.buttonList.className}>
            <li key={'exampleButton'} className={Config.buttonListItem.className}>
              <ExampleButton content={content} fileName={Config.exampleButton.fileName} className={Config.exampleButton.className} id={Config.exampleButton.id} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
