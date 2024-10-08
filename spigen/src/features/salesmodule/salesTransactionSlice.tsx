import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";



export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}



interface eInvoice {
    delivery_challan_dt: string; 
    so_ship_invoice_id: string | number; 
    invoiceNo: string; 
    invoiceDate: string;
    irnno: string; 
    client: string; 
    client_code: string | number; 
    clientaddress1: string; 
    clientaddress2: string; 
    billingaddress1: string;
    billingaddress2: string; 
    shippingaddress1: string;
    shippingaddress2: string; 
  }


interface eInvoiceState {
  data: eInvoice[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: eInvoiceState = {
  data: null,
  loading: false,
  error: null,
};
interface FetchTransactionPayload {
  wise: any;
  data: string;
}

interface FetchCreditDebitPayload {
  wise: any;
  data: string;
  type: string;
}


export const fetchInvoiceList = createAsyncThunk<
ApiResponse<eInvoice[]>,
FetchTransactionPayload
>("so_challan_shipment/getEinvoiceList", async (payload) => {
  const response = await spigenAxios.post("so_challan_shipment/getEinvoiceList", payload);
  return response.data;
});

export const fetchEwayList = createAsyncThunk<
  ApiResponse<any>,
  FetchTransactionPayload
>("so_challan_shipment/getEwayBillList", async (payload) => {
  const response = await spigenAxios.post("so_challan_shipment/getEwayBillList", payload);
  return response.data;
});

export const fetchEInvoiceData = createAsyncThunk<
  ApiResponse<any>,
  FetchCreditDebitPayload
>("so_challan_shipment/getEInvoiceData", async (payload) => {
  const response = await spigenAxios.post("soEnotes/fetchEInvoiceData", payload);
  return response.data;
});

export const printEwayBill = createAsyncThunk(
  "so_challan_shipment/printEwayBill",
  async (
    { ewayBillNo }: { ewayBillNo: string; },
    { rejectWithValue }
  ) => {
    try {
      const response = await spigenAxios.post<any>(
        "so_challan_shipment/printEwayBill",
        { ewayBillNo: ewayBillNo,  }
      );

      if (!response.data) {
        throw new Error("No data received");
      }
      // Return the entire response as expected by the fulfilled case
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const cancelEInvoice = createAsyncThunk<
ApiResponse<eInvoice[]>,
FetchTransactionPayload
>("so_challan_shipment/cancel_einvoice", async (payload) => {
  const response = await spigenAxios.post("so_challan_shipment/cancel_einvoice", payload);
  return response.data;
});

export const cancelEwayBill = createAsyncThunk<
ApiResponse<eInvoice[]>,
FetchTransactionPayload
>("so_challan_shipment/cancelEwayBill", async (payload) => {
  const response = await spigenAxios.post("so_challan_shipment/cancelEwayBill", payload);
  return response.data;
});

export const cancelCrDbEInvoice = createAsyncThunk<
ApiResponse<eInvoice[]>,
FetchTransactionPayload
>("so_challan_shipment/cancelEwayBill", async (payload) => {
  const response = await spigenAxios.post("soEnotes/cancel_einvoice", payload);
  return response.data;
});



const eTranactionRegisterSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
     
      .addCase(fetchInvoiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message || "Failed to fetch transaction list";
        }
        state.loading = false;
      })
      .addCase(fetchInvoiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transcation list";
      })
      .addCase(fetchEwayList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEwayList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message || "Failed to fetch transaction list";
        }
        state.loading = false;
      })
      .addCase(fetchEwayList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transcation list";
      })
      .addCase(fetchEInvoiceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEInvoiceData.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message || "Failed to fetch transaction list";
        }
        state.loading = false;
      })
      .addCase(fetchEInvoiceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transcation list";
      })
      .addCase(printEwayBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(printEwayBill.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(printEwayBill.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(cancelEwayBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelEwayBill.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelEwayBill.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })



  },
});


export default eTranactionRegisterSlice.reducer;
