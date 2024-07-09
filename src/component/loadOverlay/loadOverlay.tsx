import React from 'react'

const LoadOverlay: React.FC = () => {
  return (
    <div id='overlay'>
      <div id='overlay-text'>Loading...</div>
      <div id='progress-text'></div>
    </div>
  )
}

export default LoadOverlay
