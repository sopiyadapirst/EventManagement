import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";
import "./styles/Login.css";
import "./styles/Dashboard.css";
import "font-awesome/css/font-awesome.min.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
