import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // Adjust path as needed
import { Button } from "@/components/ui/button"; // Adjust path as needed
import { OverlayNoRowsTemplate } from "@/components/shared/OverlayNoRowsTemplate";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { CgArrowTopRight } from "react-icons/cg";
import { Printer } from "lucide-react";

interface ViewInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: {
    header: {
      invoiceNo?: string;
      client?: string;
      clientaddress1?: string;
      clientaddress2?: string;
      billingaddress1?: string;
      billingaddress2?: string;
      billing_pin?: string;
      billing_gstno?: string;
      billing_pan?: string;
      shippingaddress1?: string;
      shippingaddress2?: string;
      ship_pin?: string;
      ship_gstin?: string;
      ship_pan?: string;
      isEwayBill?: string;
      isEInvoice?: string;
    };
    items: {
      item_value: number;
      item_cgst: string;
      item_sgst: string;
      item_igst: string;
      item_part_no?: string;
      item_name?: string;
      item_qty?: string;
      item_rate?: string;
      delivery_challan_dt?: string;
      so_id?: string;
      shipment_id?: string;
    }[];
  };
  handlePrintInvoice: any;
  loading:any;
}

const ViewInvoiceModal: React.FC<ViewInvoiceModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  handlePrintInvoice,
  loading,
}) => {
  const columnDefs: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
    { headerName: "SO ID", field: "so_id" },
    { headerName: "SKU", field: "item_part_no" },
    {
      headerName: "Material",
      field: "item_name",
      width: 500,
      cellRenderer:"truncateCellRenderer"
    },
    { headerName: "Qty", field: "item_qty" },
    { headerName: "Rate", field: "item_rate" },
  ];
  const data = sellRequestDetails?.header;

  const itemCGSTs = sellRequestDetails?.items?.map(
    (item) => parseFloat(item.item_cgst) || 0
  );
  const itemSGSTs = sellRequestDetails?.items?.map(
    (item) => parseFloat(item.item_sgst) || 0
  );
  const itemIGSTs = sellRequestDetails?.items?.map(
    (item) => parseFloat(item.item_igst) || 0
  );

  const totalValue = sellRequestDetails?.items?.reduce(
    (acc, item) => acc + (item.item_value || 0),
    0
  );
  const totalCGST = itemCGSTs?.reduce((acc, value) => acc + value, 0);
  const totalSGST = itemSGSTs?.reduce((acc, value) => acc + value, 0);
  const totalIGST = itemIGSTs?.reduce((acc, value) => acc + value, 0);
  function fnOpenNewWindow(link:string) {
    // Define window dimensions
    var width = 920;
    var height = 500;

    // Calculate the position to center the window on the screen
    var left = (window.screen.width / 2) - (width / 2);
    var top = (window.screen.height / 2) - (height / 2);

    // Open the new window centered on the screen
    window.open(
        link,
        'Spigen',
        `width=${width},height=${height},top=${top},left=${left},status=1,scrollbars=1,location=0,resizable=yes`
    );
}

  const handleEwayClick = (module: string) => {
    const shipmentId = sellRequestDetails?.items[0]?.shipment_id || "";
    const sanitizedShipmentId = shipmentId.replace(/\//g, "_");
    if (module === "Invoice") {
      // window.open(`/salesOrder/e-inv/${sanitizedShipmentId}`, "_blank");
      fnOpenNewWindow(`/salesOrder/e-inv/${sanitizedShipmentId}`);
    } else {
      // window.open(`/salesOrder/e-way/${sanitizedShipmentId}`, "_blank");
      fnOpenNewWindow(`/salesOrder/e-way/${sanitizedShipmentId}`);
    }
  };

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
          Invoice Details : {sellRequestDetails?.header?.invoiceNo}
        </SheetTitle>

        <div className="ag-theme-quartz h-[calc(100vh-140px)] grid grid-cols-4 gap-4">
          <div className="col-span-1 max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-4 p-4">
            {/* Cards Section */}
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Bill To Detail
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Client</h3>
                <p className="text-[14px]">{data?.client}</p>
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {data?.clientaddress1 || "" + data?.clientaddress2}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Dispatch From
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {data?.billingaddress1 || "" + data?.billingaddress2}
                </p>
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px] pl-5">{data?.billing_pin}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">GST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.billing_gstno}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PAN</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.billing_pan}</p>
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
                  {data?.shippingaddress1 || "" + data?.shippingaddress2}
                </p>
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.ship_pin}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">GST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.ship_gstin}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PAN</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.ship_pan}</p>
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
                          (+){totalCGST?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">SGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){totalSGST?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">ISGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){totalIGST?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="mt-2 border-t border-gray-300 p-2"></li>
                    <li className="grid grid-cols-[1fr_150px]">
                      <div>
                        <h3 className="font-[600] text-cyan-600">
                          Sub-Total values after Taxes :
                        </h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          {(
                            totalValue +
                            totalCGST +
                            totalSGST +
                            totalIGST
                          )?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-3 flex flex-col h-full">
            <div className="flex justify-end mb-4 gap-4">
              <Button
                disabled={data?.isEInvoice === "Y"}
                onClick={() => handleEwayClick("Invoice")}
                variant={"outline"}
              >
                Generate e-Invoice <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
              </Button>
              <Button
                disabled={data?.isEwayBill === "Y"}
                onClick={() => handleEwayClick("WayBill")}
                variant={"outline"}
              >
                Generate e-Way Bill <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Print <Printer className="pl-1 h-[20px] w-[20px] font-[600]"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      handlePrintInvoice(
                        sellRequestDetails?.header?.invoiceNo,
                        "Original"
                      )
                    }
                  >
                    Original
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handlePrintInvoice(
                        sellRequestDetails?.header?.invoiceNo,
                        "Duplicate"
                      )
                    }
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handlePrintInvoice(
                        sellRequestDetails?.header?.invoiceNo,
                        "Transporter"
                      )
                    }
                  >
                    Transporter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="ag-theme-quartz flex-1">
              <AgGridReact
                rowData={sellRequestDetails?.items}
                columnDefs={columnDefs}
                // pagination={true}
                suppressCellFocus={true}
                components={{
                  truncateCellRenderer: TruncateCellRenderer,
                }}
                overlayNoRowsTemplate={OverlayNoRowsTemplate}
              />
            </div>
          </div>
        </div>
      </SheetContent>
      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default ViewInvoiceModal;

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
