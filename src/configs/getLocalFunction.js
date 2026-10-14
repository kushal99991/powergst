import  cryptFunc from '../auth/crypto/crypto'

const getLocalValue = (fieldName, types ) => {
          
       let x = null     
    if (types == true) {
         x =  localStorage.getItem(fieldName) && cryptFunc.decryptData(localStorage.getItem(fieldName))
    } else {
         x =  localStorage.getItem(fieldName)
    }
    return  x
}


const setLocalValue = (fieldName, values, types ) => {
    let x = null     
 if (types == true) {
      x =  values && localStorage.setItem(fieldName ,  cryptFunc.encryptData(values)  )
 } else {
      x =  localStorage.setItem(fieldName, values)
 }
 return  x
}

export default { getLocalValue , setLocalValue}