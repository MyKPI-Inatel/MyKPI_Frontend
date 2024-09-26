import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import Register from './pages/register';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
