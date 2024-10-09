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
  ewayBillData: [];
  invoiceData: [];
  loading: boolean;
  error: string | null;
}

const initialState: SellShipmentState = {
  data: [],
  challanDetails: [],
  dataNotes: [],
  ewayBillData: [],
  invoiceData: [],
  loading: false,
  error: null,
};
interface FetchSellInvoicePayload {
  wise: any;
  data: string;
}

interface CancelPayload {
  remark: string;
  invoice_no: string;
}

interface DebitNote {
  invoice_id: string;
  other_ref: string;
  material: {};
}
export const fetchSalesOrderInvoiceList = createAsyncThunk<
  ApiResponse<any>,
  FetchSellInvoicePayload
>("so_challan_shipment/fetchDeliveryChallan", async (payload) => {
  const response = await spigenAxios.post(
    "so_challan_shipment/fetchDeliveryChallan",
    payload
  );
  return response.data;
});

export const getchallanDetails = createAsyncThunk(
  "so_challan_shipment/getchallanDetails",
  async ({ challan_id }: { challan_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/so_challan_shipment/getDeliveryChallanDetails",
        { challan_id: challan_id }
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

export const printSellInvoice = createAsyncThunk(
  "client/printSellInvoice",
  async (
    { so_invoice, printInvType }: { so_invoice: string; printInvType: string },
    { rejectWithValue }
  ) => {
    try {
      // Replace / with _ in so_invoice
      const modifiedInvoice = so_invoice.replace(/\//g, "_");

      // Construct the URL with query parameters
      const url = `https://spigen.mscapi.live/so_challan_shipment/printSellInvoice?so_invoice=${encodeURIComponent(modifiedInvoice)}&printInvType=${encodeURIComponent(printInvType)}`;
      
      // Make the GET request
      window.open(url, "_blank");
      return;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const cancelInvoice = createAsyncThunk(
  "client/cancelInvoice",
  async (payload: CancelPayload, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/so_challan_shipment/cancelInvoice",
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

export const createEwayBill = createAsyncThunk(
  "client/createEwayBill",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post(
        "so_invoice/createEwaybill",
        payload
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createDebitEinvoice = createAsyncThunk(
  "client/createDebitEinvoice",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post(
        "soEnotes/createDebitEinvoice",
        payload
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createCreditEinvoice = createAsyncThunk(
  "client/createCreditEinvoice",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post(
        "soEnotes/createCretditEinvoice",
        payload
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const generateEInvoice = createAsyncThunk(
  "client/generateEInvoice",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post(
        "so_invoice/createEinvoice",
        payload
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createDebitNote = createAsyncThunk(
  "client/createDebitNote",
  async (payload: DebitNote, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/soEnotes/createDebitNote",
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
export const createCreditNote = createAsyncThunk(
  "client/createcreditNote",
  async (payload: DebitNote, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/soEnotes/createCreditNote",
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

export const fetchDataNotes = createAsyncThunk(
  "so_challan_shipment/fetchDataNotes",
  async ({ sono }: { sono: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/soEnotes/fetchData4Notes",
        { sono: sono }
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

export const fetchDataForEwayBill = createAsyncThunk(
  "so_challan_shipment/fetchDataForEwayBill",
  async ({ shipment_id }: { shipment_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/so_invoice/getDetailsForEwaybill",
        { shipment_id: shipment_id }
      );

      if (!response.data) {
        throw new Error("No data received");
      }
      // Return the entire response as expected by the fulfilled case
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchNoteData = createAsyncThunk(
  "so_challan_shipment/fetchNoteData",
  async ({ note_no }: { note_no: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>("soEnotes/fetchNotedata", {
        note_no: note_no,
      });

      if (!response.data) {
        throw new Error("No data received");
      }
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchDataForInvoice = createAsyncThunk(
  "so_challan_shipment/fetchDataForInvoice",
  async ({ shipment_id }: { shipment_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/so_invoice/fetchDataForinvoice",
        { shipment_id: shipment_id }
      );

      if (!response.data) {
        throw new Error("No data received");
      }
      // Return the entire response as expected by the fulfilled case
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const sellInvoiceSlice = createSlice({
  name: "sellInvoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchSalesOrderInvoiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrderInvoiceList.fulfilled, (state, action) => {
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
      .addCase(fetchSalesOrderInvoiceList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch invoice order shipment list";
      })
      .addCase(printSellInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(printSellInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(printSellInvoice.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(cancelInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createEwayBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEwayBill.fulfilled, (state,action) => {
        state.loading = false;
        state.invoiceData=action.payload.data
      })
      .addCase(createEwayBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDebitEinvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDebitEinvoice.fulfilled, (state,action) => {
        state.loading = false;
        state.invoiceData=action.payload.data
      })
      .addCase(createDebitEinvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCreditEinvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCreditEinvoice.fulfilled, (state,action) => {
        console.log(action.payload.data,"llkk")
        state.loading = false;
        state.invoiceData=action.payload.data
      })
      .addCase(createCreditEinvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generateEInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateEInvoice.fulfilled, (state,action) => {
        state.loading = false;
        state.invoiceData=action.payload.data
      })
      .addCase(generateEInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDebitNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDebitNote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createDebitNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCreditNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCreditNote.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCreditNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getchallanDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getchallanDetails.fulfilled, (state, action) => {
        state.challanDetails = action.payload?.data;
        state.loading = false;
      })
      .addCase(getchallanDetails.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(fetchDataNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDataNotes.fulfilled, (state, action) => {
        state.dataNotes = action.payload?.data;
        state.loading = false;
      })
      .addCase(fetchDataNotes.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(fetchDataForEwayBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDataForEwayBill.fulfilled, (state, action) => {
        state.ewayBillData = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchDataForEwayBill.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(fetchNoteData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNoteData.fulfilled, (state, action) => {
        state.ewayBillData = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchNoteData.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(fetchDataForInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDataForInvoice.fulfilled, (state, action) => {
        state.ewayBillData = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchDataForInvoice.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      });
  },
});

export default sellInvoiceSlice.reducer;
