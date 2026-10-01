// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import extractZip from '../../../../helper/extraZip';
import toast from "react-hot-toast";
// ** Axios Imports
import axios from 'axios'
import Swal from "sweetalert2";

import { API_URL_GSTR } from '../../../../configs/config';


export const getGSTR4ASummary = createAsyncThunk('gstr4A/getGSTR4ASummary', async (user) => {

    try {
        const response = await axios.get(API_URL_GSTR + '/api/gstr4a/get-gstr4a-summary?UserClientId=' + user.clientid + '&FromRange=' + user.finyear + '&ToRange=' + user.finmonth + '&SubscriptionId=' + user.subscriptionId + '&gstNumber=' + user.gstNumber)
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
    name: 'gstr4A',
    initialState: {
        GSTR4ASummary: [],
    },
    reducers: {
        handleGSTR4ASummary: (state, action) => {
            state.GSTR4ASummary = action.payload
        },
    },
    extraReducers: builder => {
        builder

            .addCase(getGSTR4ASummary.fulfilled, (state, action) => {
                console.log(action, "actiommmm")
                state.GSTR4ASummary = action.payload
            })

    }

})

export const {
    handleGSTR4ASummary
} = appUsersSlice.actions

export default appUsersSlice.reducer