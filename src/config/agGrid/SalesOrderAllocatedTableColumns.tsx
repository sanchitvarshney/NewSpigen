import { RowData } from "@/types/SalesOrderAllocatedInvoicesType";
import { ColDef } from "ag-grid-community";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Menu } from "antd";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  cancelNotes,
  fetchCreditDebitRegisterList,
  getNoteMaterialList,
  soNotePrint,
} from "@/features/salesmodule/creditDebitRegisterSlice";
import { printFunction } from "@/General";
import NoteMaterialListModal from "@/pages/salesModule/NoteMaterialListModal";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";

const ActionMenu: React.FC<any> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [showMaterialList, setShowMaterialList] = useState(false);
  const [form] = Form.useForm();
  const dateRange = useSelector(
    (state: RootState) => state.sellRequest.dateRange
  );
  const wiseValue = useSelector(
    (state: RootState) => state.sellRequest.wise
  );

  const handlePrintInvoice = async (orderId: string) => {
    dispatch(soNotePrint({ note_no: orderId })).then((response: any) => {
      if (response?.payload?.success) {
        printFunction(response?.payload?.data.buffer.data);
      } else {
        toast({
          title: response?.payload || "Print failed",
          className: "bg-red-600 text-white items-center",
        });
      }
    });
  };

  const handleOk = () => {
    const values = form.getFieldsValue();
    const payload: any = {
      remark: values.remark,
      note_no: row?.note_id,
    };
    dispatch(cancelNotes(payload))
      .then((response: any) => {
        if (response?.payload?.success) {
          toast({
            title: response?.payload?.message || "Cancelled successfully",
            className: "bg-green-600 text-white items-center",
          });
          dispatch(
            fetchCreditDebitRegisterList({ wise: "date", data: dateRange, noteType: wiseValue }) as any
          );
        }
      })
      .catch((error) => {
        console.error("Dispatch failed:", error);
      });
    setCancelModalVisible(false);
    form.resetFields();
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="materialList"
        onClick={() => {
          setShowMaterialList(true);
          dispatch(getNoteMaterialList({ note_no: row?.note_id }));
        }}
      >
        view
      </Menu.Item>
      <Menu.Item
        key="cancel"
        onClick={() => setCancelModalVisible(true)}
        disabled={row.status == "Cancelled"}
      >
        Cancel
      </Menu.Item>
      <Menu.Item key="print" onClick={() => handlePrintInvoice(row?.note_id)}>
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
        row={{ req_id: row?.note_id }}
        form={form}
        module="Debit Note"
      />
      <NoteMaterialListModal
        visible={showMaterialList}
        onClose={() => setShowMaterialList(false)}
        isGenerate={{ status: row?.status }}
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

  { headerName: "S.No.", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
  {
    headerName: "Status",
    field: "status",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
    maxWidth: 100,
  },
  {
    headerName: "Invoice No",
    field: "invoice_no",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
    maxWidth: 250,
  },
  {
    headerName: "CN/DN Id",
    field: "note_id",
    filter: "agTextColumnFilter",
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Other Ref",
    field: "other_ref",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
    maxWidth: 250,
  },
  {
    headerName: "Created On",
    field: "insert_dt",
    filter: "agTextColumnFilter",
    cellRenderer: "truncateCellRenderer",
  },
  {
    headerName: "Bill To Address Line 1",
    field: "billToaddress1",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Bill To Address Line 2",
    field: "billToaddress2",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Bill From Address Line 1",
    field: "billFromaddress1",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Bill From Address Line 2",
    field: "billFromaddress2",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Ship To Address Line 1",
    field: "shipToAddress1",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Ship To Address Line 2",
    field: "shipToAddress2",
    filter: "agTextColumnFilter",
    width: 400,
    cellRenderer: CopyCellRenderer,
  },
];


