import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'src/styles.css'
import React from 'react'
import LoadOverlay from './component/loadOverlay/loadOverlay'
import TopButton from './component/topButton/topButton'
import Header from './component/header/header'
import SqlContent from './component/sqlContent/sqlContent'
import Description from './component/description/description'

const App: React.FC = () => {
  return (
    <div>
      <div className='row container-fluid px-5 mt-100'>
        <Header />
        <Description />
        <SqlContent />
      </div>
      <TopButton />
      <LoadOverlay />
    </div>
  )
}

export default App
