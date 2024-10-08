import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import POLayout from "./layouts/POLayout";
import SOLayout from "./layouts/SOLayout";
import HomePage from "./pages/HomePage";
import CreatePoPage from "./pages/CreatePoPage";
import CompletedPOPage from "./pages/CompletedPOPage";
import ApprovePOPage from "./pages/ApprovePOPage";
import ManagePoPage from "./pages/ManagePoPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import RegisterSalesOrderPage from "./pages/salesModule/RegisterSalesOrderPage";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./font.css";
import Protected from "./components/Protected";
import Custom404Page from "./pages/Custom404Page";
// import SalesShipmentPage from "./pages/salesModule/SalesShipmentPage";
import SalesInvoicePage from "./pages/salesModule/SalesInvoicePage";
import AllocatedInvoicesPage from "./pages/salesModule/AllocatedInvoicesPage";
import SalesETransactionRegisterPage from "./pages/salesModule/SalesETransactionRegisterPage";
import MasterProductLayout from "./layouts/MasterProductLayout";
import MasterProductFgPage from "./pages/masterModule/MasterProductFgPage";
import MasterAddressLayout from "./layouts/MasterAddressLayout";
import MasterBillingAddressPage from "./pages/masterModule/MasterBillingAddressPage";
import MasterShippingAddressPage from "./pages/masterModule/MasterShippingAddressPage";
import BlockedPageRenderPage from "./pages/BlockedPageRenderPage";
import MasterCustomerPage from "./pages/masterModule/MasterCustomerPage";
import NotPermissionPage from "./pages/NotPermissionPage";
import CreateSalesOrderPage from "./components/salesOrder/createSalesOrder/CreateSalesOrderPage";
import CreateEwayBill from "@/config/agGrid/invoiceModule/CreateEwayBill";
import UomPage from "@/pages/masterModule/uom/UomPage";
// Define the authenticated routes
const router = createBrowserRouter([
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Protected>
    ),
    path: "/",
  },
  {
    element: (
      <Protected authentication={false}>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </Protected>
    ),
    path: "/login",
  },
  {
    element: (
      <Protected authentication={false}>
        <AuthLayout>
          <ForgotPassword />
        </AuthLayout>
      </Protected>
    ),
    path: "/forgot-password",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <CreatePoPage />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/create-po",
  },

  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <ManagePoPage />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/manage-po",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <ApprovePOPage />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/approve-po",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <POLayout>
            <CompletedPOPage />
          </POLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/completed-po",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <CreateSalesOrderPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/create",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <CreateSalesOrderPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/update/:id",
  },
  {
    element: (
      <Protected authentication>
        <CreateEwayBill />
      </Protected>
    ),
    path: "/salesOrder/e-way/:id",
  },
  {
    element: (
      <Protected authentication>
        <CreateEwayBill />
      </Protected>
    ),
    path: "/salesOrder/e-inv/:id",
  },

  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <RegisterSalesOrderPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/register",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <SalesInvoicePage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/invoice",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <AllocatedInvoicesPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/allocated",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <SOLayout>
            <SalesETransactionRegisterPage />
          </SOLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/sales/order/e-transaction-register",
  },

  //master moduls
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MasterProductLayout>
            <MasterProductFgPage />
          </MasterProductLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/product/fg",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <UomPage />
        </MainLayout>
      </Protected>
    ),
    path: "/master/uom",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MasterProductLayout>
            {/* <MasterProductSfgPage /> */}
            <NotPermissionPage />
          </MasterProductLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/product/sfg",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MasterAddressLayout>
            <MasterBillingAddressPage />
          </MasterAddressLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/dispatch-address",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MasterAddressLayout>
            <MasterShippingAddressPage />
          </MasterAddressLayout>
        </MainLayout>
      </Protected>
    ),
    path: "/master/shipping-address",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <MasterCustomerPage />
        </MainLayout>
      </Protected>
    ),
    path: "/master/client",
  },
  {
    element: (
      <Protected authentication>
        <MainLayout>
          <NotPermissionPage />
        </MainLayout>
      </Protected>
    ),
    path: "/not-permission",
  },

  {
    path: "/warning",
    element: (
      <MainLayout>
        <BlockedPageRenderPage />
      </MainLayout>
    ),
  },
  {
    path: "*",
    element: (
      <MainLayout>
        <Custom404Page />
      </MainLayout>
    ),
  },
]);

// Define the unauthenticated routes

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
