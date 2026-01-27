import React from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children, sidebarTitle, sidebarLinks }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar title={sidebarTitle} links={sidebarLinks} />
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
