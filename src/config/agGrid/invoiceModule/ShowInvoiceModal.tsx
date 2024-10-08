import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { printSellInvoice } from "@/features/salesmodule/salesInvoiceSlice";

const DataDialog = ({ open, onClose,orderId,module }: any) => {
  const { invoiceData:data } :{invoiceData:any}= useSelector(
    (state: RootState) => state.sellInvoice
  );
  const dispatch = useDispatch<AppDispatch>();
  const handleDownload = () => {
    dispatch(printSellInvoice({ so_invoice: orderId , printInvType:"Original"}));
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl h-fit max-h-[90vh] p-8 bg-white rounded-lg shadow-xl transition-transform transform overflow-y-auto">
        <Card className="rounded shadow bg-[#fff]">
          <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
            <h3 className="text-[17px] font-[600] text-slate-600">
              Create {module}
            </h3>
          </CardHeader>
          <CardContent className="mt-[10px]">
            <h2 className="text-[20px] font-[600] text-slate-600">
              {module} Bill Generation Successfull
            </h2>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <h3>E-Acknowledgement No:</h3>
              <p>{data?.AckNo?data?.AckNo:"--"}</p>
            </div>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <h3>Acknowledgment Date:</h3>
              <p>{data?.AckDt?data?.AckDt:"--"}</p>
            </div>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <h3>IRN No:</h3>
              <p className="truncate overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
                {data?.Irn?data?.Irn:"--"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <h3>Status:</h3>
              <p>{data?.Status?data?.Status:"--"}</p>
            </div>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <h3>E-Way Bill No:</h3>
              <p>{data?.EwbNo || "--"}</p>
            </div>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <h3>E-Way Date:</h3>
              <p>{data?.EwbDt || "--"}</p>
            </div>
             <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <h3>E-Way Valid Till:</h3>
              <p>{data?.EwbValidTill || "--"}</p>
            </div>
            {/* <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <h3>Info Details:</h3>
              <p>{data?.InfoDtls?.[0] || "--"}</p>
            </div> */}
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <h3>Remarks:</h3>
              <p>{data?.Remarks || "--"}</p>
            </div>

            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              {/* <h3 className="grid grid-cols-2 gap-[40px] mt-[30px]">Info Details:</h3>
            <p className="list-disc list-inside text-gray-600">
              {data.InfoDtls.map((info, index) => (
                <li key={index}>
                  <strong className="font-medium text-gray-700">{info.InfCd}:</strong> {info.Desc.join(", ")}
                </li>
              ))}
            </p> */}
            </div>

            <div className="flex justify-center gap-4 mt-20">
              <Button
                onClick={handleDownload}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Download
              </Button>
              <Button
                onClick={handleBack}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Close Window
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default DataDialog;
