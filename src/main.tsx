import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./stores/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <div className="flex min-h-screen flex-col pb-[env(safe-area-inset-bottom)]">
        <App />

        {/* Footer */}
        <footer className="mt-auto py-10 text-center text-xs text-muted-foreground">
          <span className="mr-2">🎱</span> Score Tracker — Made with by Kirin
        </footer>
      </div>
    </Provider>
  </StrictMode>
);
