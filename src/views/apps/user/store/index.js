// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import extractZip from '../../../../helper/extraZip';
import toast from "react-hot-toast";
// ** Axios Imports
import axios from 'axios'
import Swal from "sweetalert2";

import { API_URL, API_URL_GSTR, API_URL_2A, API_URL_RECO, API_URL_GSTR6, API_GSTR1_FILED, API_URL_GSTR9, API_URL_GSTR9C , API_TDSTCS_FILED} from '../../../../configs/config';
import { API_GSTR3B } from '../../../../configs/config';


export const getAllData = createAsyncThunk('appUsers/getAllData', async () => {
  const response = await axios.get('/api/users/list/all-data')
  return response.data
})

export const getData = createAsyncThunk('appUsers/getData', async params => {
  const response = await axios.get('/api/users/list/data', params)
  return {
    params,
    data: response.data.users,
    totalPages: response.data.total
  }
})

export const getUser = createAsyncThunk('appUsers/getUser', async id => {
  const response = await axios.get('/api/users/user', { id })
  return response.data.user
})

export const addUser = createAsyncThunk('appUsers/addUser', async (user, { dispatch, getState }) => {
  await axios.post('/apps/users/add-user', user)
  await dispatch(getData(getState().users.params))
  await dispatch(getAllData())
  return user
})

export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, { dispatch, getState }) => {
  await axios.delete('/apps/users/delete', { id })
  await dispatch(getData(getState().users.params))
  await dispatch(getAllData())
  return id
})


export const getImportData = createAsyncThunk('appUsers/importData', (userData) => {
  return userData
})

export const getAllCopmpanyDataById = createAsyncThunk('appUsers/getAllCopmpanyDataById', async id => {
  const response = await axios.get(API_URL + '/api/client?Id=' + id)
  return response.data
})



export const getGSTR2BSummary = createAsyncThunk('appUsers/getGSTR2BSummary', async (user) => {

  try {
    console.log("user2b", user);

    const response = await axios.get(API_URL_GSTR + '/api/gstr2b/get-gstr2b-summary?UserClientId=' + user.clientid + '&FromRange=' + user.finyear + '&ToRange=' + user.finmonth + '&SubscriptionId=' + user.subscriptionId + '&gstNumber=' + user.gstNumber)
    console.log(response, "responseeee")
    user?.setLoader && user?.setLoader(true)
    if (response.data !== null && response.data?.status != 500) {
      user?.setLoader && user?.setLoader(false)

      // toast.success("GSTR2B Data Fetch Succesfully", {
      //   position: "top-right",
      // });
      // user.giveLoader1(false)
      return await extractZip(response.data.data)
    }
    else if (response.data.status == 500) {
      user?.setLoader && user?.setLoader(false)

      toast.error(response?.data?.errorMessage, {
        position: "top-right",
      });
      return response.data.errorMessage
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "",
      text: error?.message,
      customClass: {
        confirmButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  } finally {
    // user.setLoader(false)
  }
})


export const getGSTR9Summary = createAsyncThunk('appUsers/getGSTR9Summary', async (user) => {
  try {
    user.setLoader(true)
    const response = await axios.get(API_URL_GSTR9 + '/api/gstr9filed/get-gstr9filed?UserClientId=' + user.clientId + '&FromFinancialYearId=' + user.fromYear + '&ToFinancialYearId=' + user.toYear + '&SubscriptionId=' + user.subscriptionId + '&GSTNumber=' + user.gstNumber)
    if (response.data !== null && response.data?.status != 500) {
      user.setDownloadInProgress(false)
      return await extractZip(response.data.data)
    }
    else if (response.data.status == 500) {
      toast.error(response?.data?.errorMessage, {
        position: "top-right",
      });
      return response.data.errorMessage
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "",
      text: error?.message,
      customClass: {
        confirmButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  } finally {
    user.setLoader(false)
  }
})

export const getGSTR9CSummary = createAsyncThunk('appUsers/getGSTR9CSummary', async (user) => {
  try {
    user.setLoader(true)
    const response = await axios.get(API_URL_GSTR9C + '/api/GSTR9CFiled/get-gstr9cfiled?UserClientId=' + user.clientId + '&FromFinancialYearId=' + user.fromYear + '&ToFinancialYearId=' + user.toYear + '&SubscriptionId=' + user.subscriptionId + '&GSTNumber=' + user.gstNumber)
    if (response.data !== null && response.data?.status != 500) {
      user.setDownloadInProgress(false)
      return await extractZip(response.data.data)
    }
    else if (response.data.status == 500) {
      toast.error(response?.data?.errorMessage, {
        position: "top-right",
      });
      return response.data.errorMessage
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "",
      text: error?.message,
      customClass: {
        confirmButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  } finally {
    user.setLoader(false)
  }
})


export const getGSTR6SummaryRedux = createAsyncThunk('appUsers/getGSTR6SummaryRedux', async (user) => {

  const response = await axios.get(API_URL_GSTR6 + '/api/gstr6filed/get-gstr6-filed-summary?UserClientId=' + user.UserClientId + '&FromRange=' + user.FinancialYear + '&ToRange=' + user.FinMonth + '&SubscriptionId=' + user.subId + '&gstNumber=' + user.G_GSTIN)
  if (response.data !== null) {
    return await extractZip(response.data.data)
  }
})

export const getGSTR3BSummary = createAsyncThunk('appUsers/getGSTR3BSummary', async (user) => {

  try {
    const response = await axios.get(API_GSTR3B + '/api/gstr3bfiled/get-gstr3bfiled?UserClientId=' + user.clientid + '&FromRange=' + user.finyear + '&ToRange=' + user.finmonth + '&SubscriptionId=' + user.subscriptionId + '&GSTNumber=' + user.gstNumber)
    console.log(response, "responseeee")
    if (response.data !== null && response.data?.status != 500) {
      // toast.success("GSTR3B Data Fetch Succesfully", {
      //   position: "top-right",
      // });
      return await extractZip(response.data.data)
    }
    else if (response.data.status == 500) {
      toast.error(response?.data?.errorMessage, {
        position: "top-right",
      });
      return response.data.errorMessage
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "",
      text: error?.message,
      customClass: {
        confirmButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  }
})


export const getGSTR2ASummary = createAsyncThunk('appUsers/getGSTR2ASummary', async (user) => {
  console.log(user)
  const response = await axios.post(API_URL_2A + '/api/gstr2a/get-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
  return response.data
})


export const deleteNotification = createAsyncThunk('appUsers/deleteNotification', async (payfire) => {
  console.log("firestor id=", payfire)
  const response = await axios.post(API_URL_RECO + '/api/purchase/delete-purchase-firestore?documentId=' + payfire?.id1 + '&nodeName=' + payfire?.id2)
  // await axios.get(API_URL_2A + '/api/gstr2a/get-summary?UserClientId=' + UserClientId + '&FromRange=' + FinancialYearId + '&ToRange=' + FinMonth)
  return response
})

export const getGSTR1FiledSummary = createAsyncThunk('appUsers/getGSTR1FiledSummary', async (user) => {
  let upload = (user.upload == null || user.upload == undefined) ? false : user.upload

  try {
    const response = await axios.get(API_GSTR1_FILED + '/api/gstr1filed/get-gstr1-filed-summary?UserClientId=' + user.clientid + '&FromRange=' + user.finyear + '&ToRange=' + user.finmonth + '&SubscriptionId=' + user.subscriptionId + '&gstNumber=' + user.gstNumber + '&isAlreadyUploaded=' + upload)
    console.log(response, "gstr1filedRes")
    if (response.data !== null && response.data?.status != 500) {
      // toast.success("GSTR1 Filed Data Fetch Succesfully", {
      //   position: "top-right",
      // });
      return await extractZip(response.data.data)
    }
    else if (response.data.status == 500) {
      toast.error(response?.data?.errorMessage, {
        position: "top-right",
      });
      return response.data.errorMessage
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "",
      text: error?.message,
      customClass: {
        confirmButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  }
})


export const getTDSTCSFiledSummary = createAsyncThunk('appUsers/getTDSTCSFiledSummary', async (user) => {
  let upload = (user.upload == null || user.upload == undefined) ? false : user.upload

  user.setLoader(true);
  try {
    const response = await axios.get(API_TDSTCS_FILED + '/api/tdstcsfiled/get-TDSTCS-filed-summary?UserClientId=' + user.clientid + '&FromRange=' + user.fromRange + '&ToRange=' + user.toRange + '&SubscriptionId=' + user.subscriptionId + '&gstNumber=' + user.gstNumber + '&isAlreadyUploaded=' + upload)
    if (response.data !== null && response.data?.status != 500) {
      return await extractZip(response.data.data)
    }
    else if (response.data.status == 500) {
      toast.error(response?.data?.errorMessage, {
        position: "top-right",
      });
      return response.data.errorMessage
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "",
      text: error?.message,
      customClass: {
        confirmButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  } finally {
    user.setLoader(false)
  }
})


export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedUser: null,
    allCopmpanyDataById: [],
    importData: [],
    GSTR2BSummary: [],
    GSTR6FiledSummary: [],
    // notification:[],
    // GSTR2BSummary: [],
    GSTR3BSummary: [],
    GSTR9Summary: [],
    GSTR9CSummary: [],
    notification: [],
    GSTR1FiledSummary: [],
    TDSTCSFiledSummary: [],
    isLoading: false
  },
  reducers: {
    handleCompanyDashboard: (state, action) => {
      state.allCopmpanyDataById = action.payload
    },
    handleGSTR2BSummary: (state, action) => {
      state.GSTR2BSummary = action.payload
    },
    handleGSTR3BSummary: (state, action) => {
      state.GSTR3BSummary = action.payload
    },
    handleGSTR9Summary: (state, action) => {
      state.GSTR9Summary = action.payload
    },
    handleGSTR9CSummary: (state, action) => {
      state.GSTR9CSummary = action.payload
    },
    handleGSTR1FiledSummary: (state, action) => {
      state.GSTR1FiledSummary = action.payload
      state.isLoading = action.payload.isLoading
    },
    handleTDSTCSFiledSummary: (state, action) => {
      state.TDSTCSFiledSummary = action.payload
      state.isLoading = action.payload.isLoading
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllData.fulfilled, (state, action) => {
        state.allData = action.payload
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
      .addCase(getAllCopmpanyDataById.fulfilled, (state, action) => {
        state.allCopmpanyDataById = action.payload
      })
      .addCase(getImportData.fulfilled, (state, action) => {
        state.importData = action.payload
      })
      .addCase(getGSTR2BSummary.fulfilled, (state, action) => {
        console.log(action, "actiommmm")
        state.GSTR2BSummary = action.payload
      })
      .addCase(getGSTR6SummaryRedux.fulfilled, (state, action) => {
        console.log(action, "actiommmm")
        state.GSTR6FiledSummary = action.payload
        state.isLoading = false
      })
      .addCase(getGSTR6SummaryRedux.rejected, (state, action) => {
        state.isLoading = false
      })
      .addCase(getGSTR6SummaryRedux.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getGSTR3BSummary.fulfilled, (state, action) => {
        console.log(action, "actiommmm")
        state.GSTR3BSummary = action.payload
      })
      .addCase(getGSTR9Summary.fulfilled, (state, action) => {
        state.GSTR9Summary = action.payload
      })
      .addCase(getGSTR9CSummary.fulfilled, (state, action) => {
        state.GSTR9CSummary = action.payload
      })
      .addCase(getGSTR2BSummary.rejected, (state, action) => {
        console.log(action, "actiommmm")
        // state.GSTR2BSummary = action.payload
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notification = action.payload
      })
      .addCase(getGSTR1FiledSummary.fulfilled, (state, action) => {
        console.log(action, "getGSTR1FiledSummary")
        state.GSTR1FiledSummary = action.payload
        state.isLoading = false
      })
      .addCase(getGSTR1FiledSummary.rejected, (state, action) => {
        state.isLoading = false
      })
      .addCase(getGSTR1FiledSummary.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getTDSTCSFiledSummary.fulfilled, (state, action) => {
        state.TDSTCSFiledSummary = action.payload
      })
  }
})

export const {
  handleCompanyDashboard,
  handleGSTR2BSummary,
  handleGSTR3BSummary,
  handleGSTR1FiledSummary,
} = appUsersSlice.actions

export default appUsersSlice.reducer
