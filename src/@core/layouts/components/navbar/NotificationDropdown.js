// ** React Imports
import { Fragment } from 'react'
import { onSnapshot, collection, getDocs, deleteDoc } from "@firebase/firestore"
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// import logo from './logo.svg';
import db from "../../../../firebase/firebase"
import { doc } from 'firebase/firestore';
import { deleteNotification } from '../../../../views/apps/user/store';

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, X, Check, AlertTriangle } from 'react-feather'

// ** Reactstrap Imports
import { Button, Badge, Input, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { globleVariable} from '../../../../configs/globalVariable';
import LocalFunction from '../../../../configs/getLocalFunction';

// ** Avatar Imports
const NotificationDropdown = () => {
  // ** Notification Array
  const [notification, setNotification] = useState([]);
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();

  console.log("function x has been called from notification");
   const userIds =  localStorage.getItem(globleVariable.userId)  !== null &&
   localStorage.getItem(globleVariable.userId)  !== "" && localStorage.getItem(globleVariable.userId)  !== undefined ?
    LocalFunction.getLocalValue(globleVariable.userId, true) : null
 

  useEffect(() =>  {
      if (userIds) {
        onSnapshot(doc(db, "PushNotification", userIds.toString()), (doc) => {
          console.log("new firestore changes1", doc?.data());
          if (doc?.data()) {
            setNotification([doc.data()])
          } else {
            setNotification([])
          }
        })
      }
  },
    []
  );


  useEffect(() => {
    if (notification?.length) {
      setFlag(true)
    }
  }, [notification]);

  console.log(notification, count);
  const notificationsArray = notification;

  const renderNotificationItems = () => {

    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {notification?.length ? notificationsArray?.map((item, index) => {
          return (

            <div
              className={classnames('list-item d-flex', {
                'align-items-start': !item?.switch,
                'align-items-center': item?.switch
              })}
            >
              {!item?.switch ? (
                <Fragment>
                  <div className='list-item-body flex-grow-1'>
                    {item?.name}
                    {/* <small className='notification-text'>{item.subtitle}</small> */}
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  {item?.title}
                  {item?.switch}
                </Fragment>
              )}
            </div>
            // </a>
          )
        }) : <div
          className={classnames('list-item d-flex', {
          })}
        >No Message Found</div>}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */
  const payFire = { id1: userIds, id2: "PushNotification" }

  return (
    <UncontrolledDropdown tag='li' id="notuniq1" className='dropdown-notification nav-item me-25'>
      <DropdownToggle tag='a' href='/'
        className='nav-link' onClick={(e) => {
          e.preventDefault()
          setFlag(false);
          console.log("now we will delete data from firestore")
          setTimeout(() => {
            dispatch(deleteNotification(payFire))
          }, 5000)
        }}>
        <Bell size={21} id="notuniq2" />
        {flag && <Badge pill color='danger' id="notuniq3" className='badge-up'>
          new
        </Badge>}
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0' id='notificationUL'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 me-auto'>Notifications</h4>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
      
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
