// ** React Imports
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import { usePopper } from 'react-popper'
import { useTranslation } from 'react-i18next'

// ** Utils
import { hasActiveChild } from '@layouts/utils'

// ** Hooks
import { useRTL } from '@hooks/useRTL'

// ** Horizontal Menu Items Component
import HorizontalNavMenuItems from './HorizontalNavMenuItems'

import {  globleVariable  } from '../../../../../configs/globalVariable'

const applyHeight = {
  enabled: true,
  name: 'applyHeight',
  phase: 'beforeWrite',
  fn: data => {
    const pageHeight = window.innerHeight,
      popperEl = data.state.elements.popper,
      ddTop = popperEl.getBoundingClientRect().top,
      ddHeight = popperEl.clientHeight
    let maxHeight, stylesObj
    // ** Calculate and set height
    if (pageHeight - ddTop - ddHeight - 28 < 1) {
      maxHeight = pageHeight - ddTop - 25
      stylesObj = {
        maxHeight,
        overflowY: 'auto'
      }
    }
    const ddRef = popperEl.getBoundingClientRect()
    // ** If there is not space left to open sub menu open it to the right
    if (ddRef.left + ddRef.width - (window.innerWidth - 16) >= 0) {
      popperEl.closest('.dropdown').classList.add('openLeft')
    }
    data.state.styles.popper = { ...data.state.styles.popper, ...stylesObj }
  }
}

const HorizontalNavMenuGroup = props => {
  // console.log(props);
  const flag = sessionStorage.getItem(globleVariable.isCompany) == "false"; 

// console.log("check notification")
  // ** Props
  const { item, submenu, isChild } = props

  // ** State
  const [menuOpen, setMenuOpen] = useState(false)
  const [popperElement, setPopperElement] = useState(null)
  const [referenceElement, setReferenceElement] = useState(null)

  // ** Hooks
  const [isRtl] = useRTL()

  // ** Vars
  const popperOffsetHorizontal = isRtl ? 16 : -16
  const popperPlacement = isRtl ? 'bottom-end' : 'bottom-start'
  const popperPlacementSubMenu = isRtl ? 'left-start' : 'right-start'

  // ** Hooks
  const { t } = useTranslation()
  const currentURL = useLocation().pathname
  const { update, styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: isChild ? popperPlacementSubMenu : popperPlacement,
    modifiers: [
      applyHeight,
      {
        enabled: true,
        name: 'offset',
        options: {
          offset: isChild ? [-8, 15] : [popperOffsetHorizontal, 5]
        }
      }
    ]
  })

  const menuLink = <Link
  to='/'
  onClick={e => e.preventDefault()}
  className={classnames('dropdown-toggle d-flex align-items-center', {
    'dropdown-item': submenu === true,
    'nav-link': submenu === false
  })}
>
  {item.icon}
  <span>{t(item.title)}</span>
</Link>
 

  const handleMouseEnter = () => {
    setMenuOpen(true)
    update()
  }

  return (
    <li
      ref={setReferenceElement}
      id={`${item.id}-menuviewall`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setMenuOpen(false)}
      className={classnames('dropdown', {
        show: menuOpen,
        'nav-item': submenu === false,
        'dropdown-submenu': submenu === true,
        'sidebar-group-active active': hasActiveChild(item, currentURL)
      })}
    >

{/* {!flag?(menuLink):(item.id=="dashboards"?(menuLink):(<></>))} */}

    {!flag?(menuLink) : <></>}
      <ul
        ref={setPopperElement}
        style={{ ...styles.popper }}
        {...attributes.popper}
        className={classnames('dropdown-menu', { 'first-level': submenu === false })}
      >
        <HorizontalNavMenuItems
          isChild={true}
          submenu={true}
          parentItem={item}
          menuOpen={menuOpen}
          items={item.children}
          setMenuOpen={setMenuOpen}
        />
      </ul>
    </li>
  )
}

export default HorizontalNavMenuGroup
