import { RowData } from "@/types/SalesEtransactionTypes";
import { ColDef } from "ag-grid-community";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Menu } from "antd";
import { useState } from "react";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import {
  cancelCrDbEInvoice,
  cancelEInvoice,
  cancelEwayBill,
  printEwayBill,
} from "@/features/salesmodule/salesTransactionSlice";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { printSellInvoice } from "@/features/salesmodule/salesInvoiceSlice";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";

const ActionMenu: React.FC<any> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [module, setModule] = useState("");
  const [form] = Form.useForm();

  const handlePrintInvoice = async (orderId: string, section: string) => {
    if (section === "e-waybill") {
      dispatch(printEwayBill({ ewayBillNo: orderId })).then(
        (resultAction: any) => {
          if (resultAction.payload?.success) {
            toast({
              title:
                typeof resultAction?.payload?.message === "string"
                  ? resultAction?.payload?.message
                  : JSON.stringify(resultAction?.payload?.message),
              className: "bg-green-600 text-white items-center",
            });
          } else {
            toast({
              title:
                typeof resultAction?.error?.message === "string"
                  ? resultAction?.error?.message
                  : JSON.stringify(resultAction?.error?.message),
              className: "bg-red-600 text-white items-center",
            });
          }
        }
      );
    } else {
      dispatch(
        printSellInvoice({ so_invoice: orderId, printInvType: "Original" })
      )
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = createPayload(values);

        const action = getCancelAction(payload);
        dispatch(action).then((response: any) => {
          if (response?.payload?.success) {
            toast({
              title: response?.message || "Cancelled successfully",
              className: "bg-green-600 text-white items-center",
            });
          }
        });

        setCancelModalVisible(false);
        form.resetFields();
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
        form.resetFields();
      });
  };

  const createPayload = (values: any) => {
    if (module === "e-invoice") {
      return {
        invoice_no: row?.invoiceNo,
        irn: row?.irnno,
        cancellReason: values.reason,
        remark: values.remark,
      };
    } else if (module === "e-waybill") {
      return {
        ewayBillNo: row?.eway_bill_no,
        cancellReason: values.reason,
        comment: values.remark,
      };
    } else {
      return {
        noteNo: row?.note_no,
        irn: row?.irnNo,
        cancellReason: values.reason,
        remark: values.remark,
      };
    }
  };

  const getCancelAction = (payload: any) => {
    if (module === "e-invoice") {
      return cancelEInvoice(payload);
    } else if (module === "e-waybill") {
      return cancelEwayBill(payload);
    } else {
      return cancelCrDbEInvoice(payload); // Assuming this is default action for others
    }
  };
  const menu = (
    <Menu>
      <Menu.Item
        key="cancel"
        onClick={() => {
          if (row?.eInvoiceNo) {
            setModule("e-invoice");
          } else if (row?.eway_bill_no) {
            setModule("e-waybill");
          } else {
            setModule("note");
          }
          setCancelModalVisible(true);
        }}
        disabled={
          row.eInvoice_status == "CANCELLED" ||
          row.ewaybill_status == "CANCELLED"
        }
      >
        Cancel
      </Menu.Item>
      <Menu.Item
        key="print"
        onClick={() => {
          if (row?.eInvoiceNo) {
            handlePrintInvoice(row?.invoiceNo, "e-invoice");
          } else if (row?.eway_bill_no) {
            handlePrintInvoice(row?.eway_bill_no, "e-waybill");
          } else {
            toast({
              title: "In Development , We will Update Soon!",
              className: "bg-blue-600 text-white items-center",
            });
          }
        }}
      >
        Print
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button icon={<MoreOutlined />} />
      </Dropdown>
      <ConfirmCancellationDialog
        isDialogVisible={cancelModalVisible}
        handleOk={handleOk}
        handleCancel={() => setCancelModalVisible(false)}
        row={{ req_id: row?.invoiceNo }}
        form={form}
        module="E-Invoice"
      />
    </>
  );
};

export default ActionMenu;

export const TruncateCellRenderer = (props: any) => {
  const style = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%", // Ensure the width of the cell
    display: "block", // Ensure that the content respects the overflow
  };

  return <div style={style}>{props.value}</div>;
};

export const columnDefs: ColDef<RowData>[] = [
  {
    headerName: "Actions",
    maxWidth: 100,
    cellRenderer: (params: any) => <ActionMenu row={params.data} />,
  },
  { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
  {
    headerName: "Status",
    field: "eInvoice_status",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
    maxWidth: 100,
  },
  {
    headerName: "SO ID",
    field: "so_no",
    filter: "agDateColumnFilter",
    maxWidth: 150,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Invoice Date",
    field: "eInvoiceDate",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Invoice Number",
    field: "invoiceNo",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Bill To Name",
    field: "billToName",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Bill To",
    field: "billTo",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Ack No",
    field: "eInvoiceNo",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Ack Date",
    field: "eInvoiceDate",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "IRN Number",
    field: "irnno",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Bill From Address",
    field: "billFromAddress",
    width: 400,
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Shipping Address",
    field: "shippingaddress2",
    width: 400,
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
];

export const EwayBillColumnDefs: ColDef<any>[] = [
  {
    headerName: "Actions",
    maxWidth: 100,
    cellRenderer: (params: any) => <ActionMenu row={params.data} />,
  },
  { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
  {
    headerName: "Status",
    field: "ewaybill_status",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
    maxWidth: 100,
  },
  {
    headerName: "SO Id",
    field: "so_id",
    filter: "agDateColumnFilter",
    cellRenderer: CopyCellRenderer,
    maxWidth: 150,
  },
  {
    headerName: "Invoice Date",
    field: "invoice_date",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Invoice Number",
    field: "challanId",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Supply Type",
    field: "supply_type",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Supply Type",
    field: "supply_type",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Sub Supply Type",
    field: "sub_supply_type",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Doc Type",
    field: "document_type",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Trans Type",
    field: "transaction_type",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Dispatch Name",
    field: "dispatchfrom_name",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Dispatch Address",
    field: "dispatchfrom_address",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Dispatch GST",
    field: "dispatchfrom_gstin",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Dispatch From",
    field: "dispatchfrom_place",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Dispatch State",
    field: "dispatchfrom_state",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Dispatch Pincode",
    field: "dispatchfrom_pincode",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Shipping Name",
    field: "shipto_name",
    filter: "agDateColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Shipping GST",
    field: "shipto_gstin",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Shipping Place",
    field: "shipto_place",
    filter: "agDateColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Shipping State",
    field: "shipto_state",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Shipping Pincode",
    field: "shipto_pincode",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Transport Id",
    field: "transporter_id",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Trans Doc Date",
    field: "trans_doc_no",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Vehicle",
    field: "vehicle_no",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Trans Mode",
    field: "trans_mode",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "E-way Bill Number",
    field: "eway_bill_no",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Generated Date",
    field: "generated_dt",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
];

export const CrDbColumnDefs: ColDef<any>[] = [
  {
    headerName: "Actions",
    maxWidth: 100,
    cellRenderer: (params: any) => <ActionMenu row={params.data} />,
  },
  { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
  {
    headerName: "Status",
    field: "status",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
    maxWidth: 100,
  },
  {
    headerName: "SO Id",
    field: "so_id",
    filter: "agDateColumnFilter",
    cellRenderer: CopyCellRenderer,
    maxWidth: 150,
  },
  {
    headerName: "E-Invoice Date",
    field: "eInvoiceDate",
    filter: "agDateColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "E-Invoice Number",
    field: "einvoice_no",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Invoice Number",
    field: "invoice_no",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Bill To",
    field: "billTo",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "CN/DN Id1",
    field: "note_no",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
    // cellRenderer: ({ row }) => <ToolTipEllipses text={row.note_no} copy={true} />,
  },
  {
    headerName: "IRN Number",
    field: "irnNo",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Shipping Address",
    field: "shipTo",
    width: 400,
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
];
