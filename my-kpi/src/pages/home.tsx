import { Navbar } from '../components/navbar';
import Sidebar from '../components/sidebar';

export default function Home() {
  return (
    <div className="grid grid-cols-10">
      <Navbar />
      <Sidebar />
    </div>
  );
}
