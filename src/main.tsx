import App from "@/App";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { AuthModalProvider } from "@/features/auth/context/AuthModalContext";
import "@/index.css";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/space-grotesk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AuthModalProvider>
            <App />
          </AuthModalProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
