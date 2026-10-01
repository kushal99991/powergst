// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL, API_URL_GSTR } from '../../../../configs/config';


// ** Axios Imports
import axios from 'axios'

//** get-gstr2b-pagination-data 
export const getData = createAsyncThunk('gstrDatatables/getData', async users => {
const response = await axios.post(API_URL_GSTR + '/api/gstr2b/get-gstr2b-pagination-data', users)
  if (response.data.data.length > 0) {
    return { allData: response.data.data, data: [], totalPages: response.data.data && response.data.data[0]['totalRowCount'], users }
  } else {
    return { allData: [], data: [], totalPages: null, users }
  }
})

export const datatablesSlice = createSlice({
  name: 'gstrDatatables',
  initialState: {
    data: [],
    total: 1,
    users: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.users = action.payload.users
      state.allData = action.payload.allData
      state.total = action.payload.totalPages
    })
  }
})

export default datatablesSlice.reducer
