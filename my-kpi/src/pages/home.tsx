import { Navbar } from '../components/navbar';
import Sidebar from '../components/sidebar';
import { useAuthGuard } from '../hooks/auth-guard';

export default function Home() {
  useAuthGuard();

  return (
    <div className="grid grid-cols-10">
      <Navbar />
      <Sidebar />
    </div>
  );
}
