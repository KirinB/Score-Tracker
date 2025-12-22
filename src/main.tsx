import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import { store } from "./stores";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/Footer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col pb-[env(safe-area-inset-bottom)]">
          <App />

          <Toaster position="top-center" />
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
