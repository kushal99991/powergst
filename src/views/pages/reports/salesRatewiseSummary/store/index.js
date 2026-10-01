// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import extractZip from '@helper/extraZip';
import toast from "react-hot-toast";
// ** Axios Imports
import axios from 'axios'
import Swal from "sweetalert2";

import { API_URL } from '@configs/config';
import { convertIntoURL } from '../../../../../services/utils';


export const getsalesRateSumData = createAsyncThunk('salesRateSummary/reportData', async (user) => {

    try {
        const queryString = convertIntoURL({
            UserClientId: user.UserClientId,
            UserId: user.UserId,
            FromRange: user.FromRange,
            ToRange: user.ToRange,
            gstNumber: user.gstNumber,
            // SubscriptionId: user.subId,
        });

        const response = await axios.get(API_URL + `/api/gstr1/get-sales-ratewise-summary-report?${queryString}`)

        if (response.data.data !== null && response.data?.status != 500 && response.data?.status != -13000) {

            return await extractZip(response?.data?.data)
        }
        else if (response.data.status == 500) {
            toast.error(response?.data?.errorMessage, {
                position: "top-right",
            });
            return []
        } else if (response.data?.status == -13000) {
            return []
        } else {
            toast.error(response?.data?.errorMessage, {
                position: "top-right",
            });

            return []
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
        return [];
    }

})

export const gstr1CheckReportExistData = createAsyncThunk('salesRateSummary/gstr1CheckReportExistData', async (payload) => {

    try {
        const queryString = convertIntoURL({
            UserClientId: payload.UserClientId,
            UserId: payload.UserId,
            gstNumber: payload.gstNumber,
            Type: payload.Type,

        });

       const response = await axios.get(API_URL + `/api/gstr1/check-report-exist?${queryString}`)
        // const response = await axios.get(`${API_URL}/api/gstr1/check-report-exist?${queryString}`)

        if (response.data.data !== null && response.data?.status != 500 &&   response.data?.status != -13000 ) {
            return await extractZip(response?.data?.data)
        }
        else if (response.data.status == 500   ) {
            toast.error(response?.data?.errorMessage, {
                position: "top-right",
            });
            return []
        } else if (response.data?.status  == -13000) {
            return []
        }  else {
            toast.error(response?.data?.errorMessage, {
                position: "top-right",
            });

            return []
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
        return []
    }
})


export const salesRateSumSlice = createSlice({
    name: 'appUsers',
    initialState: {
        salesRateSummary: []
    },
    reducers: {
        handleSalesRateSum: (state, action) => {
            state.salesRateSummary = action.payload
        },
        handlePurchaseCheckExistData: (state, action) => {
            state.salesRateSummary = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getsalesRateSumData.fulfilled, (state, action) => {
                state.salesRateSummary = action.payload
            })
            .addCase(gstr1CheckReportExistData.fulfilled, (state, action) => {
                console.log(action.payload, "hsnsumactionCheck1")
                state.salesRateSummary = action.payload;
            })
    }
})

export const {
    handleSalesRateSum,
    handleGstr1CheckExistData
} = salesRateSumSlice.actions

export default salesRateSumSlice.reducer