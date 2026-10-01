// ** React Imports
import { Fragment } from 'react'
import { onSnapshot, collection, getDocs } from "@firebase/firestore"
import { useEffect, useState } from 'react';
// import logo from './logo.svg';
import { db } from './firebase';

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

const NotificationDropdown = () => {
  // ** Notification Array
  const [notification, setNotification] = useState([]);
  const [count, setCount] = useState(0);
  const userIds =  localStorage.getItem(globleVariable.userId)  && LocalFunction.getLocalValue(globleVariable.userId, true)


  const fetchPost = async () => {
    await getDocs(collection(db, "PushNotification"))
      .then((querySnapshot) => {
        let x = []
        querySnapshot.docs
          .map((doc) => {
            if (doc?.id == userIds) {
              x.push(doc.data())
            }
          }
          )
        setNotification(x);
        console.log(x, "=new data");
      })
      .catch((error) => {
        console.log("error=", error)
      })
  }

    // onSnapshot(collection(db, "PushNotification"), (snapshot) => {
    //   //setNotification(snapshot.docs.map(doc => doc.data()))
    //   //setNotification(snapshot.docChanges().map(change => change.doc.data()))
    //   console.log("new firestore changes", snapshot.docChanges()?.[0]);
    //   if (snapshot.docChanges()?.[0]?.type != "removed") {
    //     setNotification(snapshot.docChanges().map(change =>
    //       // console.log("change=",change,change.doc.data());
    //       change.doc.data(
    //     ))
    //   } else {
    //     setNotification([]);
    //   }
    // }
    // ),


  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    console.log("hii", count)
    const y = count + 1
    setCount(y)
  }, [notification]);

  console.log(notification, count);
  const notificationsArray = notification;
  
  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {notification?.length ? notificationsArray.map((item, index) => {
          return (
            <div
              className={classnames('list-item d-flex', {
                'align-items-start': !item.switch,
                'align-items-center': item.switch
              })}
            >
              {!item.switch ? (
                <Fragment>
                  <div className='list-item-body flex-grow-1'>
                    {item.message}
                    {/* <small className='notification-text'>{item.subtitle}</small> */}
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  {item.title}
                  {item.switch}
                </Fragment>
              )}
            </div>
            // </a>
          )
        }) : <div
          className={classnames('list-item d-flex', {
            // 'align-items-start': false,
            // 'align-items-center': true
          })}
        >No Message Found</div>}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item me-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell size={21} />
        {count === 3 && <Badge pill color='danger' className='badge-up'>
          1
        </Badge>}
      </DropdownToggle>
      <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
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
