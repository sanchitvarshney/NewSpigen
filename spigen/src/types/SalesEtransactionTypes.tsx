export interface RowData {
    id: number;
    so_no: string;
    eInvoice_status: string;
    eInvoiceDate: string;
    billToName: string;
    billTo: string;
    eInvoiceNo: string;
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
    billFromAddress: string;
    billingaddress2: string; 
    shippingaddress1: string;
    shippingaddress2: string; 
  }