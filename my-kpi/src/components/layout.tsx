import { useAuthGuard } from '../hooks/auth-guard';
import { Navbar } from './navbar';
import Sidebar from './sidebar';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className = '' }: Readonly<LayoutProps>) => {
  useAuthGuard();

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};
