import React from 'react'
import LoadOverlay from './component/loadOverlay/loadOverlay'
import TopButton from './component/topButton/topButton'
import Header from './component/header/header'
import TabContent from './component/tabContent/tabContent'
import 'src/styles.css'
import Description from './component/description/description'

const App: React.FC = () => {
  return (
    <div>
      <div className='row container-fluid px-5 mt-100'>
        <Header />
        <Description />
        <TabContent />
      </div>
      <TopButton />
      <LoadOverlay />
    </div>
  )
}

export default App
