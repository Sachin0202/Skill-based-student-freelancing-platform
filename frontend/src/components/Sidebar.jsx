import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ title = "Dashboard", links = [] }) => {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <Link to="/" className="sidebar-brand">
                {title}
            </Link>
            <nav className="sidebar-nav">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
