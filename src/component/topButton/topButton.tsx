import React from 'react'
import TopButtonImage from 'src/image/top-button.png'

const TopButton: React.FC = () => {
  return (
    <div id='top-button-container'>
      <img id='top-button' src={TopButtonImage}></img>
    </div>
  )
}
export default TopButton
