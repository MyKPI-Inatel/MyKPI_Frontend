import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Configuration from './pages/configuration';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataProvider } from './context/data-context';

const queryClient = new QueryClient();

export function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/config" element={<Configuration />} />
        </Routes>
      </DataProvider>
    </QueryClientProvider>
  );
}
