// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import extractZip from "../../../../../helper/extraZip";
import toast from "react-hot-toast";
// ** Axios Imports
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL_CMP08 } from "../../../../../configs/config";

export const getCMP08FiledData = createAsyncThunk(
  "appCMP08Filed/getData",
  async (user) => {
    const { UserClientId, FromRange, ToRange, G_GSTIN, SubscriptionId } = user;
    try {
      const response = await axios.get(
        API_URL_CMP08 +
          "/api/cmp08filed/get-cmp08filed?UserClientId=" +
          UserClientId +
          "&FromRange=" +
          FromRange +
          "&ToRange=" +
          ToRange +
          "&gstNumber=" +
          G_GSTIN +
          "&SubscriptionId=" +
          SubscriptionId
      );
      console.log(response, "responseeee");
      if (response.data !== null && response.data?.status != 500) {
        console.log({response})
        return await extractZip(response?.data?.data);
      } else if (response.data.status == 500) {
        toast.error(response?.data?.errorMessage, {
          position: "top-right",
        });
        return response?.data?.errorMessage;
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

export const cmp08Slice = createSlice({
  name: "appUsers",
  initialState: {
    CMP08Summary: [],
  },
  reducers: {
    handleCMP08Filed: (state, action) => {
      state.CMP08Summary = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCMP08FiledData.fulfilled, (state, action) => {
      console.log(action, "actiommmm");
      state.CMP08Summary = action.payload;
    });
  },
});

export const { handleCMP08Filed } = cmp08Slice.actions;

export default cmp08Slice.reducer;
