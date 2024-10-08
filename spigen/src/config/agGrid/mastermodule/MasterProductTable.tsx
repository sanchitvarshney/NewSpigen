import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { ColDef } from "@ag-grid-community/core";
import ProductActionCellRender from "./ProductActionCellRender";
import { Tooltip } from "antd";
import { toast } from "@/components/ui/use-toast";

export const TruncateCellRenderer = (props: any) => {
  const style = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%", // Ensure the width of the cell
    display: "block", // Ensure that the content respects the overflow
  };

  return (
    <Tooltip title={props.value} placement="top">
      <div style={style}>{props.value}</div>
    </Tooltip>
  );
};

export const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    valueGetter: "node.rowIndex + 1",
    // sortable: true,
    // filter: true,
    width: 50,
  },
  {
    headerName: "Product Name",
    field: "p_name",
    sortable: true,
    filter: true,
    minWidth: 400,
    cellRenderer: TruncateCellRenderer,
  },
  // { headerName: "Product Key", field: "productKey" },
  {
    headerName: "SKU",
    field: "p_sku",
    sortable: true,
    filter: true,
    cellRenderer: (params: any) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        {params.value}
        <Button
          className="p-[2px] bg-transparent border-none shadow-none text-cyan-700 hover:bg-transparent"
          style={{ marginLeft: "10px" }}
          onClick={() => handleCopy(params.value)}
        >
          <Copy className="h-[20px] w-[20px] " />
        </Button>
      </div>
    ),
  },
  { headerName: "Unit", field: "units_name", sortable: true, filter: true },
  {
    headerName: "Category",
    field: "category",
    sortable: true,
    filter: true,
    cellRenderer: () => "Good",
  },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: (params: any) => (
      <div>
        <ProductActionCellRender params={params} />
      </div>
    ),
  },
];

// Handle Copy Button
const handleCopy = (value: any) => {
  navigator.clipboard.writeText(value); 
  toast({
    title: "Copied to clipboard: " + value,
    className: "bg-blue-600 text-white items-center",
  });
};

// Open Modal Function

export interface RowData {
  id: number;
  productName: string;
  sku: string;
  unit: string;
  category: string;
}
