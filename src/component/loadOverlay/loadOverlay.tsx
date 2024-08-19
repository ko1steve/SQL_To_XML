import React from 'react'
import * as Config from './config'

export const LoadOverlay: React.FC = () => {
  return (
    <div id={Config.overlay.id}>
      <div id={Config.overlayText.id}>Loading...</div>
      <div id={Config.progressText.id}></div>
    </div>
  )
}
