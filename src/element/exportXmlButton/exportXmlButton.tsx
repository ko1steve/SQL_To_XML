import React, { useEffect, useState } from 'react'
import { CommandType } from 'src/mainConfig'
import { DataModel } from 'src/model/dataModel'
import { Container } from 'typescript-ioc'

enum ButtonState {
  Active = 'active',
  Inactive = 'inactive'
}

export const ExportXmlButton: React.FC = () => {
  const dataModel = Container.get(DataModel)
  const [isCommandValid, setCommandValid] = useState<boolean>(dataModel.getCommandValid(dataModel.currentTab))

  useEffect(() => {
    const onCommandValidChange = (data: { commandType: CommandType, isValid: boolean }) => {
      setCommandValid(data.isValid)
    }
    const onTabChange = (commandType: CommandType) => {
      setCommandValid(dataModel.getCommandValid(commandType))
    }
    const onCommandValidChangeBinding = dataModel.onCommandValidChangeSignal.add(onCommandValidChange)
    const onTabChangeBinding = dataModel.onTabChangeSignal.add(onTabChange)
    return () => {
      dataModel.onCommandValidChangeSignal.detach(onCommandValidChangeBinding)
      dataModel.onTabChangeSignal.detach(onTabChangeBinding)
    }
  }, [])

  return (
    <div className='download-button-container'>
      <button id='download-button' className={`${(isCommandValid ? ButtonState.Active : ButtonState.Inactive)}`}>Export as XML</button>
    </div>
  )
}
