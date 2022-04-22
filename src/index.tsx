import React from "react";
import { Provider as StoreProvider } from "react-redux";
import store from "./Store";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>
);
