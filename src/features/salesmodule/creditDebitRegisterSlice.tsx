import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";
import { toast } from "@/components/ui/use-toast";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

interface SellInvoiceData {
  channel: string;
  delivery_challan_dt: string;
  so_ship_invoice_id: string;
  client: string;
  client_code: string;
  clientaddress1: string;
  clientaddress2: string;
  billingaddress1: string;
  billingaddress2: string;
  shippingaddress1: string;
  shippingaddress2: string;
}

interface SellShipmentState {
  data: SellInvoiceData[];
  challanDetails: [];
  dataNotes: [];
  materialListData: [];
  loading: boolean;
  error: string | null;
}

const initialState: SellShipmentState = {
  data: [],
  challanDetails: [],
  dataNotes: [],
  materialListData: [],
  loading: false,
  error: null,
};
interface FetchSellInvoicePayload {
  wise: any;
  noteType: string;
  data: string;
}

interface CancelPayload {
  note_no: string;
}

export const fetchCreditDebitRegisterList = createAsyncThunk<
  ApiResponse<any>,
  FetchSellInvoicePayload
>("soEnotes/getNoteList", async (payload) => {
  const response = await spigenAxios.post("soEnotes/getNoteList", payload);
  return response.data;
});

export const cancelNotes = createAsyncThunk(
  "client/cancelNotes",
  async (payload: CancelPayload, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "soEnotes/cancelNotes",
        payload
      )) as any;

      if (response?.data?.success) {
        toast({
          title: response?.data?.message,
          className: "bg-green-600 text-white items-center",
        });
      } else {
        toast({
          title: response.data.message,
          className: "bg-red-600 text-white items-center",
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
export const soNotePrint = createAsyncThunk<
  ApiResponse<any>,
  { note_no: string }
>("client/fetchClient", async ({ note_no }, { rejectWithValue }) => {
  try {
    const modifiedInvoice = note_no.replace(/\//g, "_");

    // Construct the URL with query parameters
    const url = `https://spigenapitest.mscorpres.net/soEnotes/soNotePrint?note_no=${encodeURIComponent(modifiedInvoice)}`;
    
    // Open the URL in a new tab/window
    window.open(url, "_blank");

    // Return a dummy response or a valid response structure that matches ApiResponse<any>
    return { success: true } as ApiResponse<any>; // Replace this with actual response if available

  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

export const getNoteMaterialList = createAsyncThunk<
  ApiResponse<any>,
  { note_no: string } // The argument type passed to the thunk
>("client/getNoteMaterialList", async ({ note_no }, { rejectWithValue }) => {
  try {
    const response = await spigenAxios.post<ApiResponse<any>>(
      "soEnotes/getNoteMaterialList",
      { note_no: note_no }
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
});

const creditDebitRegister = createSlice({
  name: "creditDebitRegisterSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchCreditDebitRegisterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditDebitRegisterList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.error = null;
        } else {
          state.error =
            action.payload.message ||
            "Failed to fetch invoice order shipment list";
        }
        state.loading = false;
      })
      .addCase(fetchCreditDebitRegisterList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch invoice order shipment list";
      })

      .addCase(cancelNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelNotes.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getNoteMaterialList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNoteMaterialList.fulfilled, (state, action) => {
        state.loading = false;
        state.materialListData = action.payload.data;
      })
      .addCase(getNoteMaterialList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // .addCase(soNotePrint.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(soNotePrint.fulfilled, (state) => {
      //   state.loading = false;
      // })
      // .addCase(soNotePrint.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // });
  },
});

export default creditDebitRegister.reducer;
