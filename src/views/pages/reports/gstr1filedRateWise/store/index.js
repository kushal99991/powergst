// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import extractZip from '@helper/extraZip';
import toast from "react-hot-toast";
// ** Axios Imports
import axios from 'axios'
import Swal from "sweetalert2";

import { API_URL } from '@configs/config';
import { convertIntoURL } from '../../../../../services/utils';


export const getgstr1filedRateData = createAsyncThunk('gstr1filedRate/reportData', async (user) => {

    try {

    const queryString = convertIntoURL({
      UserClientId: user.UserClientId,
      UserId: user.UserId,
      FromRange: user.FromRange,
      ToRange: user.ToRange,
      gstNumber: user.gstNumber,
      SubscriptionId: user.subId,
    });

        const response = await axios.get(`${API_URL}/api/gstr1filed/get-gstr1-ratewise-report?${queryString}` )

        if (response.data.data !== null && response.data?.status != 500 &&   response.data?.status != -13000 ) {
            const data =  await extractZip(response?.data?.data )
            return data;
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
        return [];
    }

})

export const gstr1CheckReportExistData = createAsyncThunk('gstr1HsnSummary/gstr1CheckReportExistData', async (payload) => {

    try {
        const queryString = convertIntoURL({
            UserClientId: payload.UserClientId,
            UserId: payload.UserId,
            gstNumber: payload.gstNumber,
            Type: payload.Type,

        });

       // const response = await axios.get(API_URL + `/api/gstr1/check-report-exist?${queryString}`)
        const response = await axios.get(`${API_URL}/api/gstr1/check-report-exist?${queryString}`)

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


export const gstr1filedRateSlice = createSlice({
    name: 'appUsers',
    initialState: {
        gstr1filedRate: []
    },
    reducers: {
        handleGstr1filedRate: (state, action) => {
            state.gstr1filedRate = action.payload
        },
        handlePurchaseCheckExistData: (state, action) => {
            state.gstr1filedRate = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getgstr1filedRateData.fulfilled, (state, action) => {
                state.gstr1filedRate = action.payload
            })
            .addCase(gstr1CheckReportExistData.fulfilled, (state, action) => {
                console.log(action.payload, "hsnsumactionCheck1")
                state.gstr1filedRate = action.payload
            })
    }
})

export const {
    handleGstr1filedRate,
    handleGstr1CheckExistData
} = gstr1filedRateSlice.actions

export default gstr1filedRateSlice.reducer