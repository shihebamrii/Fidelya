import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = ({ items }) => {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
            `bottom-nav-link ${isActive ? 'active' : ''}`
          }
        >
          <div className="bottom-nav-icon">{item.icon}</div>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
