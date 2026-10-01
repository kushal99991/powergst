// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** ThemeConfig Import
import themeConfig from '@configs/themeConfig'

const initialMenuCollapsed = () => {
  const item = window.localStorage.getItem('menuCollapsed')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed
}

const initialDirection = () => {
  const item = window.localStorage.getItem('direction')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.isRTL
}

const initialSkin = () => {
  const item = window.localStorage.getItem('skin')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.skin
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    skin: initialSkin(),
    isRTL: initialDirection(),
    layout: themeConfig.layout.type,
    lastLayout: themeConfig.layout.type,
    menuCollapsed: initialMenuCollapsed(),
    footerType: themeConfig.layout.footer.type,
    navbarType: themeConfig.layout.navbar.type,
    menuHidden: themeConfig.layout.menu.isHidden,
    contentWidth: themeConfig.layout.contentWidth,
    navbarColor: themeConfig.layout.navbar.backgroundColor,
    modelVerifyOTP: false,
    modelSendOTP: false,
    selectFromDate: null,
    selectToDate: null,
    selectExportFromDt : null,
    selectExportToDt: null,
    downloadClientId: null,
    exportData : false
  },
  reducers: {
    handleRTL: (state, action) => {
      state.isRTL = action.payload
      window.localStorage.setItem('direction', JSON.stringify(action.payload))
    },
    handleSkin: (state, action) => {
      state.skin = action.payload
      window.localStorage.setItem('skin', JSON.stringify(action.payload))
    },
    handleLayout: (state, action) => {
      state.layout = action.payload
    },
    handleFooterType: (state, action) => {
      state.footerType = action.payload
    },
    handleNavbarType: (state, action) => {
      state.navbarType = action.payload
    },
    handleMenuHidden: (state, action) => {
      state.menuHidden = action.payload
    },
    handleLastLayout: (state, action) => {
      state.lastLayout = action.payload
    },
    handleNavbarColor: (state, action) => {
      state.navbarColor = action.payload
    },
    handleContentWidth: (state, action) => {
      state.contentWidth = action.payload
    },
    handleMenuCollapsed: (state, action) => {
      state.menuCollapsed = action.payload
      window.localStorage.setItem('menuCollapsed', JSON.stringify(action.payload))
    },
    handleModelOTP: (state, action) => {
      state.modelVerifyOTP = action.payload
    },
    handleModelOTPSend: (state, action) => {
      state.modelSendOTP = action.payload
    },
    handleModelOTPClientId: (state, action) => {
      state.downloadClientId = action.payload
    },

    handleSelectFromDate: (state, action) => {
      state.selectFromDate = action.payload
    },
    handleSelectFromTo: (state, action) => {
      state.selectToDate = action.payload
    },
    handleSelectExportFromDt: (state, action) => {
      state.selectExportFromDt = action.payload
    },
    handleSelectExportToDt: (state, action) => {
      state.selectExportToDt = action.payload
    },
    handleExportData: (state, action) => {
      state.exportData = action.payload
    }
  }
})

export const {
  handleRTL,
  handleSkin,
  handleLayout,
  handleLastLayout,
  handleMenuHidden,
  handleNavbarType,
  handleFooterType,
  handleNavbarColor,
  handleContentWidth,
  handleMenuCollapsed,
  handleModelOTP,
  handleModelOTPSend,
  handleSelectFromDate,
  handleSelectFromTo,
  handleSelectExportFromDt,
  handleSelectExportToDt,
  handleModelOTPClientId,
  handleExportData
} = layoutSlice.actions

export default layoutSlice.reducer
