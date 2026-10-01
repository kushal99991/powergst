// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import extractZip from '@helper/extraZip';
import toast from "react-hot-toast";
// ** Axios Imports
import axios from 'axios'
import Swal from "sweetalert2";

import { API_URL } from '@configs/config';
import { convertIntoURL } from '../../../../../services/utils';


export const getsalesHsnSumData = createAsyncThunk('SalesHsnSummary/reportData', async (user) => {

    try {

        const { advanceFilters } = user;

        const queryString = convertIntoURL({
            UserClientId: user.UserClientId,
            UserId: user.UserId,
            FromRange: user.FromRange,
            ToRange: user.ToRange,
            gstNumber: user.gstNumber,
            Type: user.Type,
            MinCess: advanceFilters.Cess.from,
            MaxCess: advanceFilters.Cess.to,
            MinIGST: advanceFilters.IGST.from,
            MaxIGST: advanceFilters.IGST.to,
            MinSGST: advanceFilters.SGST.from,
            MaxSGST: advanceFilters.SGST.to,
            MinCGST: advanceFilters.CGST.from,
            MaxCGST: advanceFilters.CGST.to,
            MinTotalTaxAmount: advanceFilters.TotalValue.from,
            MaxTotalTaxAmount: advanceFilters.TotalValue.to,
            MinTotalTaxableAmount: advanceFilters.TaxableValue.from,
            MaxTotalTaxableAmount: advanceFilters.TaxableValue.to,
            MinTotalQtyAmount: advanceFilters.TotalQty.from,
            MaxTotalQtyAmount: advanceFilters.TotalQty.to,
            Month: advanceFilters.selectedMonths.join(","),
            Rate: advanceFilters.selectedRate.join(","),
            HSN: advanceFilters.HSN,
            Description: advanceFilters.Description,
            UQC: advanceFilters.UQC,
        });

        const response = await axios.get(`${API_URL}/api/gstr1/sales-hsn-summary-report?${queryString}`)
        // const response = await axios.get(API_URL + `/api/gstr1/sales-hsn-summary-report?${queryString}`)


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

export const salesHsnSumSlice = createSlice({
    name: 'appUsers',
    initialState: {
        salesHSnSummary: []
    },
    reducers: {
        handleSalesHsnSum: (state, action) => {
            state.salesHSnSummary = action.payload
        },
        handleGstr1CheckExistData: (state, action) => {
            state.salesHSnSummary = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getsalesHsnSumData.fulfilled, (state, action) => {
                console.log(action.payload, "hsnsumaction")
                state.salesHSnSummary = action.payload
            })
            .addCase(gstr1CheckReportExistData.fulfilled, (state, action) => {
                console.log(action.payload, "hsnsumactionCheck1")
                state.salesHSnSummary = action.payload
            })
    }
})

export const {
    handleSalesHsnSum,
    handleGstr1CheckExistData
} = salesHsnSumSlice.actions

export default salesHsnSumSlice.reducer