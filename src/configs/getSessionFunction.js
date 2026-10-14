import  cryptFunc from '../auth/crypto/crypto'

const getSessionValue = (fieldName, types )=> {
       let x = null     
    if (types == true) {
         x =  cryptFunc.decryptData(sessionStorage.getItem(fieldName))
    } else {
         x =  sessionStorage.getItem(fieldName) 
    }
    return  x
}


const setSessionValue = (fieldName, values, types )=> {
    let x = null     
    
 if (types == true) {
      x =  values && sessionStorage.setItem(fieldName ,  cryptFunc.encryptData(values)  )
 } else {
      x =  sessionStorage.setItem(fieldName, values )
 }
 return  x
}

export default { getSessionValue , setSessionValue}