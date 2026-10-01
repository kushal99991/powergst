// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'
import decryptData from '../auth/crypto/crypto'
import { globleVariable } from '../configs/globalVariable'
import LocalFunction from '../configs/getLocalFunction'
import SessionFunction from '../configs/getSessionFunction'

const config = useJwt.jwtConfig

const initialUser = () => {

  const item = LocalFunction.getLocalValue(globleVariable.userData, true)
  // window.localStorage.getItem('ud')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {

      state.userData = action.payload
      console.log("date payload=", action.payload);

      const userData = decryptData.encryptData(JSON.stringify(action.payload))
      const sourceType = decryptData.encryptData(JSON.stringify(action.payload.sourceType))
      const userId = decryptData.encryptData(action.payload.userId)
      const serverDateTime = decryptData.encryptData(JSON.stringify(action.payload.serverDateTime))
      const rangeFilters = decryptData.encryptData(JSON.stringify(action.payload.rangeFilters))
      const rangeFiltersITC04 = decryptData.encryptData(JSON.stringify(action.payload.rangeFiltersITC04))
      const rangeFiltersCMP08 = decryptData.encryptData(JSON.stringify(action.payload.data?.rangeFiltersCMP08))
      const rangeFiltersGSTR2B = decryptData.encryptData(JSON.stringify(action.payload.data?.rangeFiltersGSTR2B))
      const tokenKey = decryptData.encryptData(action.payload.accessToken)
      const subscriptionId = decryptData.encryptData(action.payload.subscriptionId)
      const isMultipleDownload = action.payload.data.isMultipleDownload


      localStorage.setItem(globleVariable.userData, userData) // userData
      localStorage.setItem(globleVariable.sourceType, sourceType)// sourceType
      localStorage.setItem(globleVariable.userId, userId) // userId
      localStorage.setItem(globleVariable.serverDateTime, serverDateTime) // timeDate
      localStorage.setItem(globleVariable.rangeFilters, rangeFilters)
      localStorage.setItem(globleVariable.rangeFiltersGSTR2B, rangeFiltersGSTR2B) // rangeFiltersGSTR2B
      localStorage.setItem(globleVariable.rangeFiltersITC04, rangeFiltersITC04) // rangeFiltersITC04
      console.log({rangeFiltersCMP08});
      localStorage.setItem(globleVariable.rangeFiltersCMP08, rangeFiltersCMP08)
      localStorage.setItem(config.storageTokenKeyName, tokenKey)
      localStorage.setItem(config.storageRefreshTokenKeyName, action.payload.refreshToken)
      localStorage.setItem(globleVariable.subscriptionId, subscriptionId) // subscriptionId
      localStorage.setItem(globleVariable.isMultipleDownload, isMultipleDownload) // isMultipleDownload

    },
    handleLogout: state => {
      state.userData = {}
      console.log(localStorage.getItem(globleVariable.rChk), 'localshow')

      if (localStorage.getItem(globleVariable.rChk) == 'false' || localStorage.getItem(globleVariable.rChk) == undefined ||
        localStorage.getItem(globleVariable.rChk) == '' || localStorage.getItem(globleVariable.rChk) == null) {
        localStorage.clear()
        sessionStorage.clear();
      }

      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem(config.storageTokenKeyName)
      localStorage.removeItem(config.storageRefreshTokenKeyName)
      localStorage.removeItem(globleVariable.tokenKey)
      localStorage.removeItem(globleVariable.userData)
      localStorage.removeItem(globleVariable.emailExists)
      localStorage.removeItem(globleVariable.userId)
      localStorage.removeItem(globleVariable.sourceType)
      localStorage.removeItem(globleVariable.tokenKey);
      localStorage.removeItem(globleVariable.vimportData);
      localStorage.removeItem(globleVariable.stateList);
      localStorage.removeItem(globleVariable.userMobile);
      localStorage.removeItem(globleVariable.RefreshTokenKey)
      localStorage.removeItem(globleVariable.serverDateTime)
      localStorage.removeItem(globleVariable.rangeFilters)
      localStorage.removeItem(globleVariable.rangeFiltersGSTR2B)
      localStorage.removeItem(globleVariable.subscriptionId)
      localStorage.removeItem(globleVariable.isMultipleDownload)
      localStorage.removeItem(globleVariable.rangeFiltersITC04)
      localStorage.removeItem(globleVariable.rangeFiltersCMP08)

      // ** Remove sessionStorage
      sessionStorage.removeItem('count1')
      sessionStorage.removeItem(globleVariable.selectExportFromDt)
      sessionStorage.removeItem(globleVariable.panSummary)
      sessionStorage.removeItem(globleVariable.purSelectExportFromDt)
      sessionStorage.removeItem(globleVariable.GSTR2BvsPurchase)
      sessionStorage.removeItem(globleVariable.isDeleteAction)
      sessionStorage.removeItem(globleVariable.isGstr2bItcData)
      sessionStorage.removeItem(globleVariable.isSupplierDebitNote)
      sessionStorage.removeItem(globleVariable.RecoDiff)
      sessionStorage.removeItem(globleVariable.RecoValue)
      sessionStorage.removeItem(globleVariable.purchaeFrdt)

      sessionStorage.removeItem(globleVariable.purchaeTodt)
      sessionStorage.removeItem(globleVariable.GSTR_2BTodt)
      sessionStorage.removeItem(globleVariable.GSTR_2BFrdt)
      sessionStorage.removeItem(globleVariable.purSelectExportToDt)
      sessionStorage.removeItem(globleVariable.gstr1FromDt)
      sessionStorage.removeItem(globleVariable.gstr1SelectExportToDt)
      sessionStorage.removeItem(globleVariable.gstr1FiledFromDt)
      sessionStorage.removeItem(globleVariable.gstr1FiledToDt)
      sessionStorage.removeItem(globleVariable.gstr3bSelectExportFromDt)

      sessionStorage.removeItem(globleVariable.defaultYear)
      sessionStorage.removeItem(globleVariable.isCompany)
      sessionStorage.removeItem(globleVariable.G_FY)
      sessionStorage.removeItem(globleVariable.G_Name)
      sessionStorage.removeItem(globleVariable.selectExportToDt)
      sessionStorage.removeItem(globleVariable.G_UCID)
      sessionStorage.removeItem(globleVariable.G_UCParId)
      sessionStorage.removeItem(globleVariable.G_State)
      sessionStorage.removeItem(globleVariable.G_RegType)
      sessionStorage.removeItem(globleVariable.G_FM)
      sessionStorage.removeItem(globleVariable.G_SNm)
      sessionStorage.removeItem(globleVariable.G_GSTIN)
      sessionStorage.removeItem(globleVariable.FinYear)
      sessionStorage.removeItem(globleVariable.FinMonth)

      sessionStorage.removeItem(globleVariable.p_file)
      sessionStorage.removeItem(globleVariable.p_data);
      sessionStorage.removeItem(globleVariable.pc_g1);
      sessionStorage.removeItem(globleVariable.ps_g1);
      sessionStorage.removeItem(globleVariable.recoImportDate);
      sessionStorage.removeItem(globleVariable.gstr3BFiledFromDt);
      sessionStorage.removeItem(globleVariable.gstr3BFiledToDt);
      sessionStorage.removeItem(globleVariable.f_data);
      sessionStorage.removeItem(globleVariable.f_g1);
      sessionStorage.removeItem(globleVariable.fc_g1);
      sessionStorage.removeItem(globleVariable.fs_g1);
      sessionStorage.removeItem(globleVariable.d_data);
      sessionStorage.removeItem(globleVariable.dc_g1);
      sessionStorage.removeItem(globleVariable.ds_g1);
      sessionStorage.removeItem('isValidate');
      sessionStorage.removeItem('gstr3bToDt')
      sessionStorage.removeItem("panData")
      sessionStorage.removeItem('panData1')
      sessionStorage.removeItem('finFromYear')
      sessionStorage.removeItem('monthFrom')

    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer
