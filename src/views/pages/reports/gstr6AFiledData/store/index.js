// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL, API_URL_GSTR } from '@configs/config';
import extractZip from '../../../../../helper/extraZip';
import toast from "react-hot-toast";
// ** Axios Imports
import axios from 'axios'
import Swal from "sweetalert2";


//** gstr6a-filed-data
export const getGSTR6AData = createAsyncThunk('gstr6a-data/getData', async users => {
const response = await axios.get(API_URL_GSTR + '/api/gstr6a/get-gstr6a-summary?UserClientId=' + users.UserClientId + '&FromRange=' + users.FromRange + '&ToRange=' + users.ToRange + '&SubscriptionId=' + users.SubscriptionId + '&gstNumber=' + users.gstNumber)

try {

    if (response.data !== null && response.data?.status != 500) {
        return await extractZip(response.data.data)
      }
      else if (response.data.status == 500) {
        toast.error(response?.data?.errorMessage, {
          position: "top-right",
        });
        return response.data.errorMessage
      }

} catch(error) {
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

export const gstr6ASlice = createSlice({
  name: 'gstr6a-data',
  initialState: {
    GSTR6AREPORTS: [],
  },
  reducers: {
    handleGSTR6AFiled: (state, action) => {
      state.GSTR6AREPORTS = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getGSTR6AData.fulfilled, (state, action) => {
        state.GSTR6AREPORTS = action.payload
      })
  }
})

export const {
  handleGSTR6AFiled
} = gstr6ASlice.actions

export default gstr6ASlice.reducer
