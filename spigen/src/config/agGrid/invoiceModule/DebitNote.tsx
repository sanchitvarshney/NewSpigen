import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef } from "ag-grid-community";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  debitNoteColumnDefs,
  RowData,
} from "@/config/agGrid/SalseOrderCreateTableColumns";
import DebitTextInputCellRenderer from "@/config/agGrid/invoiceModule/DebitTextInputCellRenderer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  createCreditNote,
  createDebitNote,
} from "@/features/salesmodule/salesInvoiceSlice";
import { Button, Form } from "antd";
import { ConfirmSubmissionDialog } from "@/config/agGrid/invoiceModule/ConfirmSubmissionDialog";
import { OverlayNoRowsTemplate } from "@/components/shared/OverlayNoRowsTemplate";
import FullPageLoading from "@/components/shared/FullPageLoading";

interface Item {
  item_value: number;
  cgst: string;
  sgst: string;
  igst: string;
  item_part_no?: string;
  item_name?: string;
  orderqty?: number;
  rate?: number;
  localValue?: number;
}

interface DebitNoteProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any;
  row: any;
  module?: string;
}

const DebitNote: React.FC<DebitNoteProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  row,
  module,
}) => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [igstTotal, setIgstTotal] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();

  const totalValue = sellRequestDetails?.materials?.reduce(
    (acc: number, item: Item) => {
      const orderQty = item.orderqty ?? 0;
      const rate = item.rate ?? 0;
      return acc + orderQty * rate;
    },
    0
  );

  const { currency } = useSelector(
    (state: RootState) => state.createSalesOrder
  );

  const { loading }: any = useSelector((state: RootState) => state.sellInvoice);

  useEffect(() => {
    const updatedData: RowData[] = sellRequestDetails?.materials?.map(
      (material: any) => ({
        type: material.so_type?.value || "product",
        items: material.item_code || "",
        material: material.selectedItem?.[0] || "",
        materialDescription: material.item_details || "",
        rate: parseFloat(material.rate) || 0,
        orderQty: material.orderqty || 1,
        currency: material.currency,
        gstType: material.gsttype?.[0] || "I",
        localValue: material.exchangetaxablevalue,
        foreignValue: parseFloat(material.exchangerate) || 0,
        cgst: parseFloat(material.cgst) || 0,
        sgst: parseFloat(material.sgst) || 0,
        igst: parseFloat(material.igst) || 0,
        dueDate: material.due_date || "",
        hsnCode: material.hsncode || "",
        remark: material.remark || "",
        gstRate: material?.gst_rate || 0,
        updateid: material?.updateid || 0,
        isNew: true,
      })
    );
    setRowData(updatedData);
  }, [sellRequestDetails]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (rowData && rowData.length > 0) {
        const cgstSum = rowData.reduce(
          (sum: number, item: any) => sum + (parseFloat(item.cgst) || 0),
          0
        );
        const sgstSum = rowData.reduce(
          (sum: number, item: any) => sum + (parseFloat(item.sgst) || 0),
          0
        );
        const igstSum = rowData.reduce(
          (sum: number, item: any) => sum + (parseFloat(item.igst) || 0),
          0
        );

        setCgstTotal(cgstSum);
        setSgstTotal(sgstSum);
        setIgstTotal(igstSum);
      }
    }, 5000);
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [rowData]);

  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <DebitTextInputCellRenderer
          {...props}
          setRowData={setRowData}
          currency={currency}
        />
      ),
    }),
    [currency]
  );

  const materials = {
    item_code: rowData?.map((component: RowData) =>
      typeof component.material === "object" && component.material !== null
        ? (component.material as any).id || ""
        : component.material || ""
    ),
    item_qty: rowData?.map((component: RowData) =>
      component?.orderQty === undefined
        ? null
        : +Number(+Number(component.orderQty)?.toFixed(2))
    ),
    item_rate: rowData?.map(
      (component: RowData) => Number(component.rate) || 0
    ),
    item_gst_rate: rowData?.map(
      (component: RowData) => Number(component.gstRate) || 0
    ),
    item_cgst: rowData?.map((component: RowData) => component.cgst || 0),
    item_sgst: rowData?.map((component: RowData) => component.sgst || 0),
    item_igst: rowData?.map((component: RowData) => component.igst || 0),
  };

  const onSubmit = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();

      const payload: any = {
        invoice_id: row?.req_id,
        other_ref: values.otherRef,
        material: materials,
      };

      // Dispatch the createDebitNote action
      // Close the modal after successful submission
      setIsDialogVisible(false);
      if (module === "debit") {
        await dispatch(createDebitNote(payload)).unwrap();
      } else if (module === "credit") {
        await dispatch(createCreditNote(payload)).unwrap();
      }
      form.resetFields();
      onClose();
    } catch (error) {
      // Handle validation errors or submission errors
      console.error("Validation or submission error:", error);
    }
  };
  const filteredColumnDefs = debitNoteColumnDefs;

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetHeader></SheetHeader>
      <SheetContent
        side={"bottom"}
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
      >
        {loading && <FullPageLoading />}
        <SheetTitle>
          Create {module === "debit" ? "Debit Note" : "Credit Note"} of{" "}
          {sellRequestDetails?.materials?.[0]?.orderid}
        </SheetTitle>
        <div className="ag-theme-quartz h-[calc(100vh-140px)] grid grid-cols-4 gap-4">
          <div className="col-span-1 max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-4 p-4">
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Bill To Detail
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Client</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.client?.[0]?.clientname || "--"}
                </p>
                <h3 className="font-[600]">Branch</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.client?.[0]?.clientbranch?.label || "--"}
                </p>
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.client?.[0]?.clientaddress1 || ""}{" "}
                  {sellRequestDetails?.client?.[0]?.clientaddress2 || "--"}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-600">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Dispatch From
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-500">
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.bill?.billaddress1 || ""}{" "}
                  {sellRequestDetails?.bill?.billaddress2}
                </p>
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {sellRequestDetails?.bill?.billpin || "--"}
                      </p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">GST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {sellRequestDetails?.bill?.billgstid}
                      </p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PAN</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {sellRequestDetails?.bill?.billpanno}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Ship To
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.ship?.addrshipname}
                </p>
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {sellRequestDetails?.ship?.pin}
                      </p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">GST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {sellRequestDetails?.ship?.shipgstid}
                      </p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PAN</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">
                        {sellRequestDetails?.ship?.shippanno}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Tax Detail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  <ul>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">
                          Sub-Total value before Taxes :
                        </h3>
                      </div>
                      <div>
                        <p className="text-[14px]">{totalValue?.toFixed(2)}</p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">CGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){cgstTotal?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">SGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){sgstTotal?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">IGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){igstTotal?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600] text-cyan-600">
                          Sub-Total value after Taxes :
                        </h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          {(
                            totalValue +
                            cgstTotal +
                            sgstTotal +
                            igstTotal
                          )?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-3">
            <AgGridReact
              rowData={rowData}
              columnDefs={filteredColumnDefs as (ColDef | ColGroupDef)[]}
              pagination={true}
              suppressCellFocus={true}
              components={components}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
            />
          </div>
          <ConfirmSubmissionDialog
            isDialogVisible={isDialogVisible}
            handleOk={onSubmit}
            handleCancel={() => setIsDialogVisible(false)}
            invoiceId={row?.req_id}
            form={form}
          />
        </div>
        <div className="bg-white border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
          <Button
            className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px] text-white"
            onClick={() => setIsDialogVisible(true)}
          >
            Submit
          </Button>
        </div>
      </SheetContent>
      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default DebitNote;
