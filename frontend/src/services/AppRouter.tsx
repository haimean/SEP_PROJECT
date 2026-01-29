import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from '../layout/MainLayout';
import { ConversionPage } from '../pages/ConversionPage';

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
