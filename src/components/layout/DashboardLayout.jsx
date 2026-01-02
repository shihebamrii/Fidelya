import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ sidebarItems, title }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar items={sidebarItems} title={title} />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
