import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Configuration from './pages/configuration';
import Questions from './pages/questions';
import Surveys from './pages/survey';
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
          <Route path="/questions" element={<Questions />} />
          <Route path="/surveys" element={<Surveys />} />
        </Routes>
      </DataProvider>
    </QueryClientProvider>
  );
}
