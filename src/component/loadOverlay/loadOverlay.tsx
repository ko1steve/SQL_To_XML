import React from 'react'

export const LoadOverlay: React.FC = () => {
  return (
    <div id='overlay'>
      <div id='overlay-text'>Loading...</div>
      <div id='progress-text'></div>
    </div>
  )
}
