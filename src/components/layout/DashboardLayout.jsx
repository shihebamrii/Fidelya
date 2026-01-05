import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ sidebarItems, title }) => {
  const { user } = useAuth();
  
  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-logo">
          <img src="/fidelya.png" alt="Fidelya" />
          <span className="mobile-header-title">{title}</span>
        </div>
        <div className="mobile-header-user">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </header>

      <Sidebar items={sidebarItems} title={title} />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>

      <BottomNav items={sidebarItems} />
    </div>
  );
};

export default DashboardLayout;
