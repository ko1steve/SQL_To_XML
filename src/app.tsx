import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'src/styles.css'
import React from 'react'
import { Header } from './component/header/header'
import { Description } from './component/description/description'
import { SqlContent } from './component/sqlContent/sqlContent'
import { LoadOverlay } from './component/loadOverlay/loadOverlay'
import { OverlayUI } from './component/overlayUI/overlayUI'

const App: React.FC = () => {
  return (
    <div>
      <div className='row container-fluid px-5 mt-100'>
        <Header />
        <Description />
        <SqlContent />
      </div>
      <OverlayUI />
      <LoadOverlay />
    </div>
  )
}

export default App
