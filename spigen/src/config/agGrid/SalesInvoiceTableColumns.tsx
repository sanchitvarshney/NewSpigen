import { RowData } from "@/types/SalesInvoiceTypes";
import { ColDef } from "ag-grid-community";
import { Button, Dropdown, Form } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { cancelInvoice, fetchDataNotes, fetchSalesOrderInvoiceList, getchallanDetails, printSellInvoice } from "@/features/salesmodule/salesInvoiceSlice";
import { AppDispatch, RootState } from "@/store";
import { useState } from "react";
import ViewInvoiceModal from "@/config/agGrid/invoiceModule/ViewInvoiceModal";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import DebitNote from "@/config/agGrid/invoiceModule/DebitNote";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";

const ActionMenu: React.FC<any> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [viewInvoice , setViewInvoice] = useState(false);
  const [viewDebitNote , setViewDebitNote] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [module,setModule] = useState("debit");
  const [form] = Form.useForm();
  const { challanDetails,dataNotes,loading }:any = useSelector(
    (state: RootState) => state.sellInvoice
  );
  const dateRange = useSelector(
    (state: RootState) => state.sellRequest.dateRange
  );

  const handleViewInvoice = (row:any) => {
    dispatch(getchallanDetails({ challan_id: row.so_ship_invoice_id }))
    setViewInvoice(true);
  };

  const handleViewDebitNote = (row:any) => {
    dispatch(fetchDataNotes({ sono: row.so_id }))
    setViewDebitNote(true);
  };

  const handlePrintInvoice = async (orderId: string,printInvType:string) => {
    dispatch(printSellInvoice({ so_invoice: orderId, printInvType: printInvType }));
  };


  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          remark: values.remark,
          invoice_no: row.so_ship_invoice_id,
        };
        dispatch(cancelInvoice(payload)).then((response: any) => {
          if (response?.payload?.success) {
            form.resetFields(); // Clear the form fields after submission
            dispatch(
              fetchSalesOrderInvoiceList({ wise: "datewise", data: dateRange }) as any
            );
          }
        })
        setCancelModalVisible(false);
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  const isDisabled = row?.hasInvoice === true || row.status === "Cancelled";

  const menuItems = [
    {
      key: "update",
      label: (
        <span onClick={() => handleViewInvoice(row)} style={{ color: isDisabled ? "gray" : "inherit" }}>
          View
        </span>
      ),
      disabled: isDisabled,
    },
    {
      key: "materialList",
      label: (
        <span onClick={() => setCancelModalVisible(true)} style={{ color: (row?.isEwayBill === "Y" || row?.isEInvoice === "Y") ? "gray" : "inherit" }}>
          Cancel
        </span>
      ),
      disabled: row?.isEwayBill === "Y" || row?.isEInvoice === "Y",
    },
    {
      key: "createInvoice",
      label: (
        <span onClick={() => handleViewDebitNote(row)}>Debit Note</span>
      ),
    },
    {
      key: "print",
      label: (
        <span onClick={() => {handleViewDebitNote(row); setModule("credit")}}>Credit Note</span>
      ),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <Button icon={<MoreOutlined />} />
      </Dropdown>
      <ViewInvoiceModal 
        visible={viewInvoice} 
        onClose={() => setViewInvoice(false)} 
        sellRequestDetails={challanDetails} 
        handlePrintInvoice={handlePrintInvoice} 
        loading={loading}
      />
      <ConfirmCancellationDialog
        isDialogVisible={cancelModalVisible}
        handleOk={handleOk}
        handleCancel={() => setCancelModalVisible(false)}
        row={{ req_id: row.so_ship_invoice_id }}
        form={form}
        module="Invoice"
      />
      <DebitNote 
        visible={viewDebitNote} 
        onClose={() => setViewDebitNote(false)} 
        sellRequestDetails={dataNotes || []} 
        row={{ req_id: row.so_ship_invoice_id }} 
        module = {module}
      />
    </>
  );
};

export default ActionMenu;


export const columnDefs: ColDef<RowData>[] = [
  {
    headerName: "Actions",
    maxWidth: 100,
    cellRenderer: (params: any) => <ActionMenu row={params.data} />,
  },

  { headerName: "S.No.", valueGetter: "node.rowIndex + 1", minWidth: 50 },
  { headerName: "SO ID", field: "so_id", filter: "agNumberColumnFilter" ,cellRenderer: CopyCellRenderer},
  {
    headerName: "Date",
    field: "delivery_challan_dt",
    filter: "agDateColumnFilter",
  },
  { headerName: "Channel", field: "channel", filter: "agDateColumnFilter" },
  {
    headerName: "Invoice Number",
    field: "so_ship_invoice_id",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer
  },
  // {
  //   headerName: "Bill To Code",
  //   field: "client_code",
  //   filter: "agTextColumnFilter",
  //   cellRenderer: CopyCellRenderer
  // },
  {
    headerName: "Bill To",
    field: "shipToName",
    filter: "agTextColumnFilter",
    width: 400,
  },
  {
    headerName: "e-wayBill Created",
    field: "isEwayBill",
    valueGetter: (params) => (params?.data?.isEwayBill === "N" ? "No" : "Yes"),
  },
  {
    headerName: "e-Invoice Created",
    field: "isEInvoice",
    valueGetter: (params) => (params?.data?.isEInvoice === "N" ? "No" : "Yes"),
  },
];
