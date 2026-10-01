// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_URL, API_URL_GSTR } from '@configs/config';
import extractZip from '../../../../../helper/extraZip';
import toast from "react-hot-toast";
// ** Axios Imports
import axios from 'axios'
import Swal from "sweetalert2";


//** gstr6a-filed-data
export const getIFFData = createAsyncThunk('iif-data/getData', async users => {
const response = await axios.get(API_URL_GSTR + '/api/ifffiled/get-iff-filed-summary?UserClientId=' + users.UserClientId + '&FromRange=' + users.FromRange + '&ToRange=' + users.ToRange + '&SubscriptionId=' + users.SubscriptionId + '&gstNumber=' + users.gstNumber)

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

export const iFFSlice = createSlice({
  name: 'iff-data',
  initialState: {
    IFFREPORTS: [],
  },
  reducers: {
    handleIFFFiled: (state, action) => {
      state.IFFREPORTS = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getIFFData.fulfilled, (state, action) => {
      console.log(action,"Actio.apyload")
        state.IFFREPORTS = action.payload
      })
  }
})

export const {
  handleIFFFiled
} = iFFSlice.actions

export default iFFSlice.reducer
