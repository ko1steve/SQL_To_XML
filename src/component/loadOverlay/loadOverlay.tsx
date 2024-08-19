import React from 'react'
import * as Config from './config'

export const LoadOverlay: React.FC = () => {
  return (
    <div id={Config.overlayId}>
      <div id={Config.overlayTextId}>Loading...</div>
      <div id={Config.progressTextId}></div>
    </div>
  )
}
