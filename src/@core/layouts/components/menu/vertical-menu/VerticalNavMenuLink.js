// ** React Imports
import { NavLink } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import  menuOpenPermission  from '@helper/menuOpenPermission'
import { urlAccessMessage } from '@configs/config'
import { urlEndpointConfig } from '@configs/urlEndpoint'


const VerticalNavMenuLink = ({ item, activeItem  }) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink
  const navigate = useNavigate();

  // ** Hooks
  const { t } = useTranslation()


  const handleClick = (e) => {

      // ** Registration type wise permission menu
      let returnUrl = menuOpenPermission(e.navLink.split("?")[0])

      if (returnUrl == true) {
        navigate(urlEndpointConfig.DASHBOARD)
        Swal.fire({
          icon: "warning",
          title: "",
          text:  urlAccessMessage ,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      }
}


  return (
    <li
     onClick={ () => handleClick(item)}
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      })}
    >
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || '/'
            }
          : {
              to: item.navLink || '/',
              className: ({ isActive }) => {
                if (isActive && !item.disabled) {
                  return 'd-flex align-items-center active'
                }
              }
            })}
        onClick={e => {
          if (item.navLink.length === 0 || item.navLink === '#' || item.disabled === true) {
            e.preventDefault()
          }
        }}
      >
        {item.icon}
        <span className='menu-item text-truncate'>{t(item.title)}</span>

        {item.badge && item.badgeText ? (
          <Badge className='ms-auto me-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
