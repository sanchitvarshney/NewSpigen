import { Dispatch, SetStateAction } from "react";
export interface MasterCustomer {
    clientId: string;
    clientEdit:boolean;
    setClientEdit:Dispatch<SetStateAction<boolean>>;
    params:any
    clientBranch:boolean,
    setClientBranch:Dispatch<SetStateAction<boolean>>;
    editView:boolean;
    setEditView:Dispatch<SetStateAction<boolean>>;
    module?:string
  }
  export interface Props {
    uiState: MasterCustomer;
  }
  