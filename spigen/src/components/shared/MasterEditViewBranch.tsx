import { Props } from "@/types/masterModule/masterCustomerTypes";
import React, { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ReusableTable from "./ReusableTable";
import { editViewColdef } from "@/config/agGrid/mastermodule/CustomerTable";

import { transformEditViewTable } from "@/helper/TableTransformation";
import { Button } from "../ui/button";
import { Edit2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchClientDetails} from "@/features/salesmodule/createSalesOrderSlice";
import UpdateClientBranch from "@/components/shared/UpdateClientBranch";

const MasterEditViewBranch: React.FC<Props> = ({ uiState }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { editView, setEditView, params } = uiState;
  const { clientDetails } = useSelector(
    (state: RootState) => state.createSalesOrder
  );
  const [rowId, setRowId] = useState<any>();
  const [clientBranch, setClientBranch] = useState<boolean>(false);
  const [clientData, setClientData] = useState<any>(null);
  const components = useMemo(
    () => ({
      editViewCellRenderer: (row: any) => {
        useEffect(() => {
          if (params.data.clientID) {
            dispatch(fetchClientDetails(params.data.clientID) as any);
          }
        }, [params]);
        return (
          <Button className="bg-transparent text-slate-600  hover:bg-[#f5f5f5]">
            <Edit2
              className="h-[20px] w-[20px]"
              onClick={() => {
                setRowId(row.data.addressId);
                setClientBranch(true);
              }}
            />
          </Button>
        );
      },
    }),
    []
  );

  useEffect(() => {
    if (clientDetails) {
      const foundClient = clientDetails.find(
        (client: any) => client?.addressID === rowId
      );
      setClientData(foundClient || null); // Set to null if not found
    }
  }, [rowId, clientDetails]);


  return (
    <Sheet open={editView} onOpenChange={setEditView}>
      <SheetContent
        className="min-w-[100%]"
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle>All Branch: {params?.data?.clientID}</SheetTitle>
        </SheetHeader>
        <div className="mt-[15px]">
          <ReusableTable
            components={components}
            heigth="h-[calc(100vh-70px)]"
            endpoint={`client/branches?clientCode=${params?.data?.clientID}`}
            columns={editViewColdef}
            transform={transformEditViewTable}
            method="get"
          />
          {clientBranch && (
            <UpdateClientBranch
              open={clientBranch}
              onClose={() => setClientBranch(false)}
              data={clientData}
              params={params}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MasterEditViewBranch;
