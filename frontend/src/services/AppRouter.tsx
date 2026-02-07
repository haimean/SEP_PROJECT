import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AutoTrainPage from "../pages/AutoTrainPage";
import { ConversionPage } from "../pages/ConversionPage";
import HomePage from "@/pages/HomePage";
import { MainLayout } from "../layout/MainLayout";

<Route path="/autotrain" element={<AutoTrainPage />} />;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
            
                <HomePage />
           
            }
          />
          <Route path="/auto-train" element={<AutoTrainPage />} />
          <Route
            path="/chatbot"
            element={
              <MainLayout>
                <ConversionPage />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
