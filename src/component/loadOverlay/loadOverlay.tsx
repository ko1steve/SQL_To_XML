import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import * as Config from './config'
import { Container } from 'typescript-ioc'
import { DataModel } from 'src/model/dataModel'

export const LoadOverlay: React.FC = () => {
  const [isLoad, setLoad] = useState(false)

  const dataModel = Container.get(DataModel)

  const onStartLoad = () => setLoad(true)
  const onCompleteLoad = () => setLoad(false)

  useEffect(() => {
    const onStartLoadBinding = dataModel.onStartLoadSignal.add(onStartLoad)
    const onCompleteLoadBinding = dataModel.onCompleteLoadSignal.add(onCompleteLoad)
    return () => {
      dataModel.onStartLoadSignal.detach(onStartLoadBinding)
      dataModel.onCompleteLoadSignal.detach(onCompleteLoadBinding)
    }
  }, [])

  return (
    <div id={Config.overlay.id} style={{ display: isLoad ? 'flex' : 'none' }}>
      <div id={Config.overlayText.id}>Loading...</div>
    </div>
  )
}
