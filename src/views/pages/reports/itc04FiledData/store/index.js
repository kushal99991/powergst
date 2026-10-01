  // ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import extractZip from '../../../../../helper/extraZip';
import toast from "react-hot-toast";
// ** Axios Imports
import axios from 'axios'
import Swal from "sweetalert2";
import { API_URL_ITC04 } from '../../../../../configs/config';



export const getItc04FiledData = createAsyncThunk('appItc04Filed/getData', async (user) => {

    try {
      const response = await axios.get(API_URL_ITC04 + '/api/itc0Filed/get-itc04-filed-summary?UserClientId=' + user.UserClientId + '&range=' + user.range +  '&SubscriptionId=' + user.SubscriptionId + '&gstNumber=' + user.gstNumber)
      console.log(response, "responseeee")
      if (response.data !== null && response.data?.status != 500) {
        return await extractZip(response?.data?.data)
      }
      else if (response.data.status == 500) {
        toast.error(response?.data?.errorMessage, {
          position: "top-right",
        });
        return response?.data?.errorMessage
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


  export const itc04Slice=createSlice({
    name:'appUsers',
    initialState:{
    ITC04Summary:[]
    },
    reducers:{
      handleItc04Filed: (state, action) => {
        state.ITC04Summary = action.payload
      }
    },
    extraReducers: builder => {
      builder
        .addCase(getItc04FiledData.fulfilled, (state, action) => {
          console.log(action, "actiommmm")
          state.ITC04Summary   = action.payload
        })
    }
  })

  export const{
    handleItc04Filed
  }=itc04Slice.actions

  export default itc04Slice.reducer