// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import extractZip from '../../../../helper/extraZip';
import toast from "react-hot-toast";
// ** Axios Imports
import axios from 'axios'
import Swal from "sweetalert2";

import { API_URL, API_URL_GSTR, API_URL_2A, API_URL_RECO } from '../../../../configs/config';


export const getGSTR2ASummary = createAsyncThunk('gstr2A/getGSTR2ASummary', async (user) => {

    try {
        const response = await axios.post(API_URL_GSTR + '/api/gstr2a/get-summary?UserClientId=' + user.clientid + '&FromRange=' + user.finyear + '&ToRange=' + user.finmonth + '&SubscriptionId=' + user.subscriptionId + '&gstNumber=' + user.gstNumber)
        console.log(response, "responseeee")
        if (response.data !== null && response.data?.status != 500) {
            // toast.success("GSTR2A Data Fetch Succesfully", {
            //     position: "top-right",
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

export const appUsersSlice = createSlice({
    name: 'gstr2A',
    initialState: {
        GSTR2ASummary: [],
    },
    reducers: {
        handleGSTR2ASummary: (state, action) => {
            state.GSTR2ASummary = action.payload
        },
    },
    extraReducers: builder => {
        builder

            .addCase(getGSTR2ASummary.fulfilled, (state, action) => {
                console.log(action, "actiommmm")
                state.GSTR2ASummary = action.payload
            })

    }

})

export const {
    handleGSTR2ASummary
} = appUsersSlice.actions

export default appUsersSlice.reducer