// File: D:\cse412\project\job_portal_rag\frontend_chat\src\main.jsx
import React from "react";
import ReactDOM from "react-dom/client"; 
import { ChakraProvider } from "@chakra-ui/react"; 
import App from "./App"; 
import "./index.css"; // Optional global CSS 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);