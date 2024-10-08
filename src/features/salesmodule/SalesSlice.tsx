import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";
import { toast } from "@/components/ui/use-toast";

interface SellRequestPayload {
  headers: {
    channel: string;
    customer: string;
    customer_branch: string;
    customer_address1: string;
    customer_address2: string;
    customer_gstin: string;
    bill_id: string;
    billing_address1: string;
    billing_address2: string;
    isSameClientAdd: string;
    shipping_id: string;
    shipping_address1: string;
    shipping_address2: string;
    shipping_pinCode: string;
    [key: string]: any;
  };
  materials: {
    items: string[];
    qty: number[];
    price: number[];
    gst_rate: number[];
    so_type: string[];
    hsn: string[];
    cgst: number[];
    sgst: number[];
    igst: number[];
    gst_type: string[];
    currency: string[];
    exchange_rate: number[];
    due_date: string[];
    remark: string[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export const createSellRequest = createAsyncThunk<
  ApiResponse<any>,
  SellRequestPayload
>("/sellRequest/createSellRequest", async (payload) => {
  try {
    const response = await spigenAxios.post(
      "/sellRequest/createSellRequest",
      payload
    );
    if (!response.data.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.data.message,
        className: "bg-red-600 text-white items-center",
      });
    } else {
      toast({
        title: "Success",
        description: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const updateSellRequest = createAsyncThunk<
  ApiResponse<any>,
  SellRequestPayload
>("/sellRequest/updateSellRequest", async (payload) => {
  try {
    const response = await spigenAxios.post(
      "/sellRequest/soDataUpdate",
      payload
    );
    if (!response.data.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.data.message,
        className: "bg-red-600 text-white items-center",
      });
    } else {
      toast({
        title: "Success",
        description: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

interface SellRequest {
  index: number;
  hasInvoice: boolean;
  req_id: string;
  channel: string;
  type: string;
  customer_code: string;
  client_addr_id: string;
  bill_id: string;
  ship_id: string;
  customer: string;
  project_id: string;
  cost_center: string;
  delivery_term: string;
  payment_term: string;
  create_by: string;
  create_dt: string;
  status: string;
}

interface SellRequestState {
  data: SellRequest[] | null;
  updateData: [];
  sellRequestDetails: [];
  dateRange: any;
  wise: any;
  loading: boolean;
  error: string | null;
}

const initialState: SellRequestState = {
  data: null,
  updateData: [],
  sellRequestDetails: [],
  dateRange: null,
  wise: null,
  loading: false,
  error: null,
};
interface FetchSellRequestPayload {
  wise: any;
  data: string;
}

interface CancelPayload {
  remark: string;
  so: string;
}

export interface DeletePayload {
  item: string;
  so_id: string;
  updaterow: string;
}

interface InvoicePayload {
  bill_id: string;
  client_addr_id: string;
  client_id: string;
  invoice_no: string;
  nos_of_boxes: string;
  remark: string;
  shipment_id: string[];
  so_id: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export const fetchSellRequestList = createAsyncThunk<
  ApiResponse<SellRequest[]>,
  FetchSellRequestPayload
>("sellRequest/fetchSellRequestList", async (payload) => {
  const response = await spigenAxios.post(
    "sellRequest/fetchSellRequestList",
    payload
  );
  return response.data;
});

export const fetchDataForUpdate = createAsyncThunk(
  "client/fetchData",
  async ({ clientCode }: { clientCode: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/sellRequest/fetchData4Update",
        { sono: clientCode }
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

export const printSellOrder = createAsyncThunk(
  "client/printSellOrder",
  async ({ so_id }: { so_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/sellRequest/printSellOrder",
        { so_id: so_id }
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

export const cancelSalesOrder = createAsyncThunk(
  "client/cancelSalesOrder",
  async (payload: CancelPayload, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/sellRequest/cancelSO",
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

export const deleteProduct = createAsyncThunk(
  "client/deleteProduct",
  async (payload: DeletePayload, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/sellRequest/deleteProduct",
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

export const fetchSellRequestDetails = createAsyncThunk(
  "client/fetchSellRequestDetails",
  async ({ req_id }: { req_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/sellRequest/fetchSellRequestDetails",
        { req_id }
      );

      if (!response.data) {
        throw new Error("No data received");
      }

      // Return the entire response as expected by the fulfilled case
      return response.data?.message;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchSalesOrderShipmentList = createAsyncThunk<
  ApiResponse<any>,
  { data: string; wise: any }
>("sellRequest/fetchSalesOrderShipmentList", async (payload) => {
  const response = await spigenAxios.post(
    "so_challan_shipment/fetchSalesOrderShipmentList",
    payload
  );
  return response.data;
});

export const createInvoice = createAsyncThunk<
  ApiResponse<any>,
  { payload: InvoicePayload }
>("sellRequest/createInvoice", async (payload) => {
  const response = await spigenAxios.post(
    "/so_challan_shipment/createDeliveryChallan",
    payload
  );
  return response.data;
});

const sellRequestSlice = createSlice({
  name: "sellRequest",
  initialState,
  reducers: {
    setDateRange(state, action: any) {
      state.dateRange = action.payload;
    },
    clearUpdatedData(state) {
      state.updateData = [];
    },

    setWise(state, action: any) {
      console.log(action.payload)
      state.wise=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSellRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSellRequest.fulfilled, (state, action) => {
        state.data = (action.payload.data);
        state.loading = false;
      })
      .addCase(createSellRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create sell request";
      })

      .addCase(updateSellRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSellRequest.fulfilled, (state, action) => {
        state.data = (action.payload.data);
        state.loading = false;
      })
      .addCase(updateSellRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create sell request";
      })

      .addCase(fetchSellRequestList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellRequestList.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchSellRequestList.rejected, (state, action) => {
        console.error("Fetch failed:", action.error);
        state.error = action.error?.message || null;
        state.loading = false;
      })

      .addCase(fetchDataForUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDataForUpdate.fulfilled, (state, action) => {
        state.updateData = action.payload?.data;
        state.loading = false;
      })
      .addCase(fetchDataForUpdate.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(printSellOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(printSellOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(printSellOrder.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })

      .addCase(cancelSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSalesOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchSellRequestDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellRequestDetails.fulfilled, (state, action) => {
        state.sellRequestDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchSellRequestDetails.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })

      .addCase(fetchSalesOrderShipmentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrderShipmentList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.error = null;
        } else {
          state.error =
            action.payload.message ||
            "Failed to fetch sales order shipment list";
        }
        state.loading = false;
      })
      .addCase(fetchSalesOrderShipmentList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch sales order shipment list";
      })
      // Handle the createInvoice action
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create invoice";
      });
  },
});

export const { setDateRange,setWise,clearUpdatedData } = sellRequestSlice.actions;
export default sellRequestSlice.reducer;
