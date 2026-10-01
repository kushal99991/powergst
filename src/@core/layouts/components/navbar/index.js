// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import NavbarUser from './NavbarUser'
import NavbarBookmarks from './NavbarBookmarks'
// src/assets/images/logo/powerlogo.png
import GenericGSTLogo from '@src/assets/images/logo/powerlogo.png'
const ThemeNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
         <NavbarBookmarks setMenuVisibility={setMenuVisibility} /> 
         <div className='col-sm-3 text-center'>
         <img className='img-fluid w-50 m-auto' src={GenericGSTLogo} alt='power-gst-logo' />
         </div>
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
