import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./stores/index.ts";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <div className="flex flex-col pb-[env(safe-area-inset-bottom)]">
        <App />
        <Toaster position="bottom-center" />
        {/* Footer */}
        <footer className="mt-auto py-10 text-center text-xs text-muted-foreground">
          <span className="mr-2">🎱</span> Score Tracker — Made with ❤️ by{" "}
          <a
            href="https://www.facebook.com/ebs.bi/"
            className="text-blue-500"
            target="_blank"
          >
            Minh Nhân
          </a>
        </footer>
      </div>
    </Provider>
  </StrictMode>
);
