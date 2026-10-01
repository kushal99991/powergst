import { useNavigate } from 'react-router-dom'
import { DefaultRoute } from '../router/routes'
import cryptofunc from '../auth/crypto/crypto'

import { globleVariable } from '../configs/globalVariable' 
import LocalFunction from '../configs/getLocalFunction'

// ** Checks if an object is empty (returns boolean)

const userDataDetail = LocalFunction.getLocalValue(globleVariable.userData, true )


export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */

 

export const isUserLoggedIn = () =>  localStorage.getItem(globleVariable.userData) 
export const getUserData = () => JSON.parse(userDataDetail)

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = () => {
  return DefaultRoute
  // if (userRole === 'admin') return DefaultRoute
  // if (userRole === 'client') return '/access-control'
  // return '/login'
}

export const tokenExpiresRedirect = () => {
 // const navigate =  useNavigate()
 sessionStorage.removeItem('loginTime')
 sessionStorage.removeItem('L_C')
  localStorage.removeItem(globleVariable.userData);
  localStorage.removeItem(globleVariable.userId);
  localStorage.removeItem(globleVariable.tokenKey)
  localStorage.removeItem(globleVariable.RefreshTokenKey);
  localStorage.setItem('expired', true);
  window.location.href = '/login'
 // navigate('/login')
}


// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#ea5455', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#ea5455', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const getColumnIndexes = (columnNames,hotRef) => {
  const hotInstance = hotRef?.current?.hotInstance;
  const colHeaders = hotInstance?.getColHeader();
  const columnIndexes = columnNames?.map((columnName) => colHeaders?.findIndex((header) => header === columnName));
  return columnIndexes;
};

export const getColumnIndex = (columnName, hotRef) => {
  const hotInstance = hotRef?.current?.hotInstance;
  const colHeaders = hotInstance?.getColHeader();
  const columnIndex = colHeaders?.findIndex((header) => header === columnName);
  return Number(columnIndex);
};

export const allJoin = (col, listIndex) =>{
  const sentence = listIndex.reduce((acc, word) => {   
      if(word){
          return acc + col+ "!=" + word +'&&';
      }          
  }, '');
  return sentence; 
}

/**
 * Use this function to sort month and year
 * @param {*} data example: ['Mar-2024', 'May-2023', 'Jan-2023', 'Jan-2022']
 * @returns example: ["Jan-2022", "Jan-2023", "Mar-2023", "May-2023"]
 */
export function sortByMonthYear(months) {

  const data = [...new Set(months)]

  // Helper function to convert month abbreviation to numerical value
  function getMonthNumber(monthName) {
      return new Date(`${monthName}-01-2022`).getMonth() + 1;
  }

  // Parse and format each entry
  let formattedData = data?.map(entry => {
      let [month, year] = entry?.split('-');
      return { month: getMonthNumber(month), year: parseInt(year), entry };
  });

  // Sort the formatted data by year and month
  formattedData.sort((a, b) => {
      if (a.year !== b.year) {
          return a.year - b.year;
      } else {
          return a.month - b.month;
      }
  });

  // Extract the original entries from the sorted data
  let sortedEntries = formattedData.map(obj => obj.entry);
  return sortedEntries;
}

/**
 * use this function to destruction the value from the array
 * @param {*} data example: [{rate: "0"}, {rate: "1"}]
 * @param {*} field example: "rate"
 * @param {*} setValue react.setState
 */
export function grabAndSetDetails(data, field,setValue) {
  console.log("COMING",data)
  if (Array.isArray(data) && data.length > 0) {
    const setThis = []
     data.forEach(element => {
      // always consider as unique value
      if (element?.[field] && !setThis.includes(element[field])) setThis.push(element[field])
     });

     setValue(setThis.sort((a, b) => a - b))
  }
}
