import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LoveInvitation from "../app/LoveInvitation";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element was not found");
}

createRoot(root).render(
  <StrictMode>
    <LoveInvitation />
  </StrictMode>,
);
