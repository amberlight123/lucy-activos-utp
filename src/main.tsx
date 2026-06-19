import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/geist-sans";
import "./index.css";
import { App } from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
