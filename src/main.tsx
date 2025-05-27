import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";

import { Toaster } from "sonner";
import AppRouter from "@/router";
import "./index.css"; // TailwindCSS entry

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Toaster richColors position="top-right" />

      <AppRouter />
    </Provider>
  </React.StrictMode>
);
