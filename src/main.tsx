import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./font.css";
import { moduleregistri } from "./config/agGrid/ModuleRegistry.ts";


moduleregistri()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App/>
  </Provider>
);
