import { SidebarMenuLinkType } from "@/types/MainLayout";

export const sidebarMenulinklist: SidebarMenuLinkType[] = [
  { name: "Dashboard", path: "/" },
  {
    name: "Order Management",
    subMenu: [
      {
        name: "Master",
        subMenu: [
          {
            name: "Components",
            subMenu: [
              { name: "Material", path: "/not-permission" },
              { name: "Service", path: "/not-permission" },
            ],
          },
          { name: "Component Map", path: "/not-permission" },
          { name: "Products", path: "/not-permission" },
          { name: "HSN map", path: "/not-permission" },
          { name: "Groups", path: "/not-permission" },
          { name: "Locations", path: "/not-permission" },
          { name: "Dispatch address", path: "/not-permission" },
          // { name: "Shipping address", path: "/not-permission" },
          {
            name: "Bill Of Material",
            subMenu: [
              { name: "Create Bom", path: "/not-permission" },
              { name: "Manage Bom", path: "/not-permission" },
            ],
          },
          { name: "Vender / Suppliar", subMenu: [{ name: "Add / Rectify", path: "/not-permission" }] },
          {
            name: "Customer / Client",
            subMenu: [
              { name: "Add", path: "/not-permission" },
              { name: "View", path: "/not-permission" },
            ],
          },
        ],
      },
      {
        name: "Procurement",
        subMenu: [
          { name: " Create PO", path: "/not-permission" },
          { name: "Manage PO", path: "/not-permission" },
          { name: "Compleated PO", path: "/not-permission" },
        ],
      },
      {
        name: "Sales Order",
        subMenu: [
          { name: "Create Sales Order", path: "/sales/order/create" },
          { name: "Sales Order Register", path: "/sales/order/register" },
          { name: "Invoice Register", path: "/sales/order/invoice" },
          { name: "CN/DN Register", path: "/sales/order/allocated" },
          { name: "e-Transaction Invoices", path: "/sales/order/e.transaction-register" },
        ],
      },
      {
        name: "Warehouse",
        subMenu: [
          { name: "MR Approval", path: "/not-permission" },
          { name: "Inward", path: "/not-permission" },
          { name: "Transfer", path: "/not-permission" },
          { name: "Pic Slip", path: "/not-permission" },
          { name: "Batch Allocation", path: "/not-permission" },
        ],
      },
      {
        name: " FG(s) Inwarding",
        subMenu: [
          { name: "Pending FG(s)", path: "/not-permission" },
          { name: "Complete FG(s)", path: "/not-permission" },
        ],
      },
      {
        name: "FG(s) OUT",
        subMenu: [
          { name: "Create FG(s) OUT", path: "/not-permission" },
          { name: "View FG(s) OUT", path: "/not-permission" },
        ],
      },
      {
        name: "Production",
        subMenu: [{ name: "PPC", path: "/not-permission" }],
      },
      {
        name: "Report (s)",
        subMenu: [
          { name: "Inventory report", path: "/not-permission" },
          { name: "Printing", path: "/not-permission" },
        ],
      },
      {
        name: "   Query (s)",
        subMenu: [{ name: "Q1-Q2", path: "/not-permission" }],
      },
      {
        name: " Physical Stock",
        subMenu: [
          { name: "Create Physical Stock", path: "/not-permission" },
          { name: "View Physical Stock", path: "/not-permission" },
        ],
      },
    ],
  },
  { name: "Customer Management", subMenu: [{ name: " Customer Enquiry", path: "/not-permission" }] },
];
export const materialmenu = [
  {
    name: "Master",
    subMenu: [
      // {
      //   name: "Components",
      //   subMenu: [
      //     { name: "Material", path: "/not-permission" },
      //     { name: "Service", path: "/not-permission" },
      //   ],
      // },
      // { name: "Component Map", path: "/not-permission" },
      { name: "UOM", path: "/master/uom" },
      { name: "Products", path: "/master/product/fg" },
      // { name: "HSN map", path: "/not-permission" },
      // { name: "Groups", path: "/not-permission" },
      // { name: "Locations", path: "/not-permission" },
      { name: "Dispatch address", path: "/master/dispatch-address" },
      // { name: "Shipping address", path: "/master/shipping-address" },
      // {
      //   name: "Bill Of Material",
      //   subMenu: [
      //     { name: "Create Bom", path: "/not-permission" },
      //     { name: "Manage Bom", path: "/not-permission" },
      //   ],
      // },
      // { name: "Vender / Suppliar", subMenu: [{ name: "Add / Rectify", path: "/not-permission" }] },
      {
        name: "Customer / Client",
        path: "/master/client", 
      },
    ],
  },
  // {
  //   name: "Procurement",
  //   subMenu: [
  //     { name: " Create PO", path: "/create-po" },
  //     { name: "Manage PO", path: "/manage-po" },
  //     { name: "Compleated PO", path: "/approve-po" },
  //   ],
  // },
  {
    name: "Sales Order",
    subMenu: [
      { name: "Sales Order Create", path: "/sales/order/create" },
      { name: "Register Sales Order", path: "/sales/order/register" },
      { name: "Invoice Register", path: "/sales/order/invoice" },
      { name: "CN/DN Register", path: "/sales/order/allocated" },
      { name: "e-Transaction Invoices", path: "/sales/order/e-transaction-register" },
    ],
  },
  // {
  //   name: "Warehouse",
  //   subMenu: [
  //     { name: "MR Approval", path: "/not-permission" },
  //     { name: "Inward", path: "/not-permission" },
  //     { name: "Transfer", path: "/not-permission" },
  //     { name: "Pic Slip", path: "/not-permission" },
  //     { name: "Batch Allocation", path: "/not-permission" },
  //   ],
  // },
  // {
  //   name: " FG(s) Inwarding",
  //   subMenu: [
  //     { name: "Pending FG(s)", path: "/not-permission" },
  //     { name: "Complete FG(s)", path: "/not-permission" },
  //   ],
  // },
  // {
  //   name: "FG(s) OUT",
  //   subMenu: [
  //     { name: "Create FG(s) OUT", path: "/not-permission" },
  //     { name: "View FG(s) OUT", path: "/not-permission" },
  //   ],
  // },
  // {
  //   name: "Production",
  //   subMenu: [{ name: "PPC", path: "/not-permission" }],
  // },
  // {
  //   name: "Report (s)",
  //   subMenu: [
  //     { name: "Inventory report", path: "/not-permission" },
  //     { name: "Printing", path: "/not-permission" },
  //   ],
  // },
  // {
  //   name: "   Query (s)",
  //   subMenu: [{ name: "Q1-Q2", path: "/not-permission" }],
  // },
  // {
  //   name: " Physical Stock",
  //   subMenu: [
  //     { name: "Create Physical Stock", path: "/not-permission" },
  //     { name: "View Physical Stock", path: "/not-permission" },
  //   ],
  // },
];
