import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Configuration from './pages/configuration';
import Questions from './pages/questions';
import Surveys from './pages/survey';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DataProvider } from './context/data-context';
import { RespondSurveys } from './pages/respond-surveys';
import { SurveyBarChart } from './pages/graph-survey';

const queryClient = new QueryClient();

export function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/config" element={<Configuration />} />
          <Route path="/questions/survey/:surveyId" element={<Questions />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/surveys/:surveyId" element={<RespondSurveys />} />
          <Route path="/reports/:surveyId" element={<SurveyBarChart />} />
        </Routes>
      </DataProvider>
    </QueryClientProvider>
  );
}
