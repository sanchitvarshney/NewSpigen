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
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CgArrowTopRight } from "react-icons/cg";

interface NoteMaterialListModalProps {
  visible: boolean;
  onClose: () => void;
  isGenerate: any;
}

const NoteMaterialListModal: React.FC<NoteMaterialListModalProps> = ({
  visible,
  onClose,
  isGenerate,
}) => {
  const {
    materialListData,
    loading,
  }: { materialListData: any; loading: boolean } = useSelector(
    (state: RootState) => state.creditDebitRegister
  );

  const TruncateCellRenderer = (props: any) => {
    const style = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%", // Ensure the width of the cell
      display: "block", // Ensure that the content respects the overflow
    };

    return <div style={style}>{props.value}</div>;
  };

  const columnDefs: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
    {
      headerName: "Material",
      field: "item_name",
      filter: "agTextColumnFilter",
      width: 400,
      cellRenderer: "truncateCellRenderer",
    },
    {
      headerName: "SKU",
      field: "item_no",
      cellRenderer: "truncateCellRenderer",
    },
    { headerName: "Qty", field: "item_qty" },
    { headerName: "Rate", field: "item_rate" },
    { headerName: "CGST", field: "item_cgst" },
    { headerName: "SGST", field: "item_sgst" },
    { headerName: "IGST", field: "item_igst" },
  ];
  const data = materialListData?.header;

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
    const shipmentId = materialListData?.header?.note_id || "";
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
        <SheetTitle>
          Invoice Details : {materialListData?.header?.note_id}
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
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {data?.billToaddress1 || "" + data?.billToaddress2}
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
                  {data?.billFromaddress1 || "" + data?.billFromaddress2}
                </p>
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px] pl-5">{data?.billFromPin}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">GST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.billFromGst}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PAN</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.billFromPan}</p>
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
                  {data?.shipToAddress1 || "" + data?.shipToAddress2}
                </p>
                <ul>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PinCode</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.shipToPin}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">GST</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.shipToGst}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1fr_150px] mt-4">
                    <div>
                      <h3 className="font-[600]">PAN</h3>
                    </div>
                    <div>
                      <p className="text-[14px]">{data?.shipToPan}</p>
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
                        <p className="text-[14px]">
                          {data?.totalValue?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">CGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){data?.totalCgst?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">SGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){data?.totalSgst?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">ISGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){data?.totalIgst?.toFixed(2)}
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
                            data?.totalValue +
                            data?.totalCgst +
                            data?.totalSgst +
                            data?.totalIgst
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
                disabled={isGenerate === "Active"}
                onClick={() => handleEwayClick("Invoice")}
                variant={"outline"}
              >
                Generate e-Invoice <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
              </Button>
            </div>
            <div className="ag-theme-quartz flex-1">
              <AgGridReact
                rowData={materialListData?.materials}
                columnDefs={columnDefs}
                suppressCellFocus={true}
                components={{ truncateCellRenderer: TruncateCellRenderer }}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </SheetContent>
      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default NoteMaterialListModal;
