// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// ** Axios Imports
import axios from 'axios'
import extractZip from "../../../../../helper/extraZip";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { API_URL, API_URL_GSTR, API_URL_2A, API_URL_RECO } from '@configs/config';

export const getGSTR1ExcelValidateFiledData = createAsyncThunk(
    "appGSTR1ExcelValidate/getGSTR1ExcelValidateData",
    async (payload) => {

      try {
        const response = await axios.post(
        //   "http://192.168.x.x:8081/api/purchase/get-error-pagination-data" ,  payload
         API_URL + "/api/gstr1/get-error-pagination-data" ,  payload
        );

        if (response.data !== null && response.data?.status != 500) {

          return await extractZip(response?.data?.data);
        } else if (response.data.status == 500) {
          toast.error(response?.data?.errorMessage, {
            position: "top-right",
          });
          return   response?.data?.errorMessage;
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
    }
  );


export const getFailed = createAsyncThunk('excelData/getFailed', (failed) => {
    return { failedData: failed }
})

export const getDuplicate = createAsyncThunk('excelData/getDuplicate', (duplicate) => {
    return { duplicateData: duplicate }
})

export const getPassed = createAsyncThunk('excelData/getPassed', (passed) => {
  return { passedData: passed }
})

export const importGSTR1ExcelValidationSlice = createSlice({
    name: 'excelData',
    initialState: {
        failedData: [],
        duplicateData: [],
        passedData: [],
        GSTR1_EXCEL_VALIDATE: [],
        isLoading:false
    },
    reducers: {
        handleGSTR1ExcelValidate : (state, action) => {
          console.log(action,"actionnnn1")

          state.GSTR1_EXCEL_VALIDATE = action.payload.GSTR1_EXCEL_VALIDATE
          state.isLoading = action.payload.isLoading
      }
    },
    extraReducers: builder => {
        builder
            .addCase(getFailed.fulfilled, (state, action) => {
                state.failedData = action.payload.failedData
            })
            .addCase(getDuplicate.fulfilled, (state, action) => {
                state.duplicateData = action.payload.duplicateData
            })
            .addCase(getPassed.fulfilled, (state, action) => {
              state.passedData = action.payload.passedData
          })
            .addCase(getGSTR1ExcelValidateFiledData.pending, (state, action) => {
                state.isLoading = true
            })
            .addCase(getGSTR1ExcelValidateFiledData.rejected, (state, action) => {
              // console.log(state,"actionnnn")
              // console.log(action,"actionnnn")
              state.isLoading = false
            })
            .addCase(getGSTR1ExcelValidateFiledData.fulfilled, (state, action) => {
              // console.log(state,"actionnnn")
              // debugger
              console.log(action.payload,"actionnnn")
                state.GSTR1_EXCEL_VALIDATE = action.payload
                state.isLoading = false
            })
    }
})


export const {
  handleGSTR1ExcelValidate
} = importGSTR1ExcelValidationSlice.actions

export default importGSTR1ExcelValidationSlice.reducer



// // ** Redux Imports
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// export const getFailed = createAsyncThunk('excelData/getFailed', (failed) => {
//     return { failedData: failed }
// })

// export const getDuplicate = createAsyncThunk('excelData/getDuplicate', (duplicate) => {
//     return { duplicateData: duplicate }
// })

// export const importSlice = createSlice({
//     name: 'excelData',
//     initialState: {
//         failedData: [],
//         duplicateData: [],
//         passedData: []
//     },
//     reducers: {},
//     extraReducers: builder => {
//         builder
//             .addCase(getFailed.fulfilled, (state, action) => {
//                 state.failedData = action.payload.failedData
//             })
//             .addCase(getDuplicate.fulfilled, (state, action) => {
//                 state.duplicateData = action.payload.duplicateData
//             })
//     }
// })

// export default importSlice.reducer
