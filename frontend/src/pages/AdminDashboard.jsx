import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { LayoutDashboard, Users, Briefcase } from 'lucide-react';
import Card from '../components/Card';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const links = [
        { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { label: 'Students', path: '/admin/students', icon: <Users size={20} /> },
        { label: 'Clients', path: '/admin/clients', icon: <Briefcase size={20} /> },
    ];

    const [stats, setStats] = React.useState([
        { label: 'Total Students', value: 0, color: '#3B82F6' },
        { label: 'Total Clients', value: 0, color: '#3B82F6' },
        { label: 'Total Jobs', value: 0, color: '#3B82F6' },
    ]);
    const [jobs, setJobs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = fetch('http://localhost:8080/api/admin/stats').then(res => res.json());
        const fetchJobs = fetch('http://localhost:8080/api/admin/recent-jobs').then(res => res.json());

        Promise.all([fetchStats, fetchJobs])
            .then(([statsData, jobsData]) => {
                setStats([
                    { label: 'Total Students', value: statsData?.totalStudents || 0, color: '#3B82F6' },
                    { label: 'Total Clients', value: statsData?.totalClients || 0, color: '#3B82F6' },
                    { label: 'Total Jobs', value: statsData?.totalJobs || 0, color: '#3B82F6' },
                ]);
                if (Array.isArray(jobsData)) setJobs(jobsData);
            })
            .catch(err => console.error("Failed to load admin data", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <DashboardLayout sidebarTitle="Admin" sidebarLinks={links}>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <span className="ml-3 text-secondary">Loading admin insights...</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebarTitle="Admin" sidebarLinks={links}>
            <header className="mb-8">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </header>

            <div className="stats-grid mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ backgroundColor: stat.color }}>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <Card title="Recent Jobs">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Job</th>
                                <th>Client</th>
                                <th>Budget</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job.id}>
                                    <td>{job.title}</td>
                                    <td>{job.client ? job.client.name : 'Unknown'}</td>
                                    <td>{job.budget}</td>
                                    <td>
                                        <span className={`badge badge-${job.status ? job.status.toLowerCase().replace('_', '-') : 'open'}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default AdminDashboard;
