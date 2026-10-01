// ** React Imports
import { NavLink } from 'react-router-dom'
import { Fragment, useState } from "react";

// ** Third Party Components
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { urlEndpointConfig } from '@configs/urlEndpoint'

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import menuOpenPermission from '@helper/menuOpenPermission'
import { urlAccessMessage } from '@configs/config'
// import encryptData from "../../../../auth/"

const HorizontalNavMenuLink = ({ item, isChild, setMenuOpen }) => {

  const [isInstall, setIsInstall] = useState(false)

  if (item?.externalLink) {
    console.log("navlink=", item);
  }

  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink
  const navigate = useNavigate();

  // ** Hooks
  const { t } = useTranslation()

  const checkExtensionInstallation = (username, password) => {
    var checkI = false
    console.log(window?.chrome, "windows chrome", chrome.runtime);

    if (username && password) {
      if (window.chrome && chrome.runtime) {
        // chrome.runtime.sendMessage("mnjpnkkmgjpogcfdfocfcebcjnogdedf", 'check_extension', response => {
          chrome.runtime.sendMessage("mleepjflfnmbhojompkpheinajoapmeo", 'check_extension', response => {
          if (response && response.installed) {
            console.log("content chrome response=", response);
          
          } else {
            console.log("You have install our chrome extension yet or it is disabled!");

            Swal.fire({
              icon: "warning",
              title: "You haven't installed our chrome extension yet or it is disabled!",
              // text: urlAccessMessage,
              customClass: {
                confirmButton: "btn btn-danger",
              },
              buttonsStyling: false,
            }).then(function () {
              // navigate("/dashboard/company");
              window.open('https://chromewebstore.google.com/detail/GenericGST/mleepjflfnmbhojompkpheinajoapmeo?authuser=0&hl=en')
            });
            setIsInstall(false)
          }
        });
      } else {
        // alert("chrome.runtime is not available")
        Swal.fire({
          icon: "warning",
          title: "You haven't installed our chrome extension yet or it is disabled",
          // text: urlAccessMessage,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        }).then(function () {
          // navigate("/dashboard/company");
          window.open('https://chromewebstore.google.com/detail/GenericGST/mleepjflfnmbhojompkpheinajoapmeo?authuser=0&hl=en')
        });
        // alert("You didn't have install our chrome extension yet or it is disabled")
        console.log("chrome.runtime is not available");

        setIsInstall(false)

      }
    } else {

      Swal.fire({
        icon: "warning",
        title: "You must have GST Portal username and password to login!",
        // text: urlAccessMessage,
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

    }

    // return checkI
  };

  const handleClick = (e) => {
    if (item?.externalLink && item?.navLink?.includes('gst.gov.in')) {
      console.log("navlink=2", item);
      // var data = [sessionStorage.getItem('U_N'), sessionStorage.getItem('P_C'), 'LOGIN', ["04", "05"], '3B', '2022-23']
      // var data = [sessionStorage.getItem('U_N'), sessionStorage.getItem('P_C'), 'LOGIN', ["04", "05", "06", "07"], 'GSTR1','2022-23']
      var data = [sessionStorage.getItem('U_N'), sessionStorage.getItem('P_C'), 'LOGIN']

      setTimeout(() => {
        // const newWindow = window.open('https://services.gst.gov.in/services/login');
      }, 300);

      setTimeout(() => {
        window.postMessage(data, "*");
      }, 500);

      // console.log("checking chrome function", checkExtensionInstallation());

      checkExtensionInstallation(sessionStorage.getItem('U_N'), sessionStorage.getItem('P_C'))


    }

    if (setMenuOpen) {
      setMenuOpen(false)
      // ** Registration type wise permission menu
      let returnUrl = menuOpenPermission(e.navLink.split("?")[0])

      if (returnUrl == true) {
        navigate(urlEndpointConfig.DASHBOARD)
        Swal.fire({
          icon: "warning",
          title: "",
          text: urlAccessMessage,
          customClass: {
            confirmButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });
      }
    }
  }


  return (
    <li
      onClick={() => handleClick(item)}
      className={classnames('nav-item ms-1', {
        disabled: item.disabled
      })}
    >
      <LinkTag

        className={classnames('d-flex align-items-center', {
          'dropdown-item': isChild,
          'nav-link': !isChild
        })}
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? isInstall ? {
            href: item.navLink || '#',
            // className:'nav-link active'
            // className:'ms-1 text-danger'
          } : {}
          : {
            to: item.navLink || '/',
            className: ({ isActive }) => {
              const commonClass = 'd-flex align-items-center'
              if (isActive && !item.disabled && item.navLink !== '#') {
                if (isChild) {
                  return `${commonClass} dropdown-item active`
                } else {
                  return `${commonClass} nav-link active`
                }
              } else {
                if (isChild) {
                  return `${commonClass} dropdown-item`
                } else {
                  return `${commonClass} nav-link`
                }
              }
            }
          })}
      /*eslint-enable */
      >
        {item.icon}
        <span>{t(item.title)}</span>
      </LinkTag>
    </li>
  )
}

export default HorizontalNavMenuLink
