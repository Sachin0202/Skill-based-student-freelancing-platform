import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { LayoutDashboard, Briefcase, FileText } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const links = [
        { label: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
        { label: 'Find Work', path: '/student/jobs', icon: <Briefcase size={20} /> },
        { label: 'My Work', path: '/student/work', icon: <FileText size={20} /> },
    ];

    const [availableJobs, setAvailableJobs] = React.useState([]);
    const [mySubmissions, setMySubmissions] = React.useState([]);
    const [myJobs, setMyJobs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const location = useLocation();
    const isMyWork = location.pathname === '/student/work';

    const { user } = useAuth();

    React.useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        // Fetch My Submissions AND My Jobs
        const fetchSubmissions = fetch(`http://localhost:8080/api/submissions/student/${user.id}`).then(res => res.json());
        const fetchMyJobs = fetch(`http://localhost:8080/api/jobs/freelancer/${user.id}`).then(res => res.json());
        const fetchAvailable = fetch('http://localhost:8080/api/jobs').then(res => res.json());

        Promise.all([fetchSubmissions, fetchMyJobs, fetchAvailable])
            .then(([subsData, myJobsData, availableData]) => {
                setMySubmissions(subsData || []);
                setMyJobs(myJobsData || []);
                if (Array.isArray(availableData)) setAvailableJobs(availableData);
                else setAvailableJobs([]);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to fetch dashboard data");
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return (
            <DashboardLayout sidebarTitle="Student" sidebarLinks={links}>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <span className="ml-3 text-secondary">Loading...</span>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout sidebarTitle="Student" sidebarLinks={links}>
                <div className="p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            </DashboardLayout>
        );
    }

    const handleAccept = async (jobId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/jobs/accept/${jobId}/${user.id}`, { method: 'POST' });
            if (!res.ok) throw new Error("Failed to accept");
            alert("Job Accepted! You can now start working.");
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Failed to accept job");
        }
    };

    const renderAcceptedWork = () => (
        <div>
            <h2 className="text-xl font-bold mb-4">Accepted Work</h2>
            {myJobs.filter(j => j.status === 'IN_PROGRESS' || j.status === 'SUBMITTED').length === 0 ? (
                <p className="text-secondary text-sm italic">No accepted work yet. Find a job below!</p>
            ) : (
                <div className="grid gap-4">
                    {myJobs.filter(j => j.status === 'IN_PROGRESS' || j.status === 'SUBMITTED').map(job => (
                        <Card key={job.id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{job.title}</h3>
                                    <p className="text-sm text-secondary mb-2">Budget: ${job.budget}</p>
                                    <span className={`badge badge-${job.status.toLowerCase().replace('_', '-')}`}>
                                        {job.status}
                                    </span>
                                </div>
                                {job.status === 'IN_PROGRESS' && (
                                    <Link to={`/submit-work/${job.id}`}>
                                        <Button variant="primary" size="sm">Submit Work</Button>
                                    </Link>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <DashboardLayout sidebarTitle="Student" sidebarLinks={links}>
            <header className="mb-8">
                <h1 className="text-2xl font-bold">{isMyWork ? 'My Work' : 'Student Dashboard'}</h1>
                <p className="text-secondary">{isMyWork ? 'Track your accepted work and past submissions.' : 'Welcome back! Here is your quick overview.'}</p>
            </header>

            {isMyWork ? (
                <div className="space-y-8">
                    {/* Accepted Work Section */}
                    {renderAcceptedWork()}

                    {/* Submissions Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Past Submissions</h2>
                        {mySubmissions.length === 0 ? (
                            <p className="text-secondary text-sm italic">No historical submissions yet.</p>
                        ) : (
                            <div className="grid gap-4">
                                {mySubmissions.map(sub => (
                                    <Card key={sub.id}>
                                        <h3 className="font-bold">{sub.job ? sub.job.title : 'Job Deleted'}</h3>
                                        <p className="text-sm text-secondary">Submitted on: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                                        <p className="mt-2 text-sm text-primary">File: {sub.workLink}</p>
                                        <span className="badge badge-success mt-2 inline-block">File Uploaded</span>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Summary of Accepted Work on Dashboard */}
                    {renderAcceptedWork()}

                    <div>
                        <h2 className="text-xl font-bold mb-4">Available Jobs</h2>
                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                            {availableJobs.filter(j => j.status === 'OPEN').map((job) => (
                                <Card key={job.id} title={job.title}>
                                    <p style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Budget: ${job.budget}</p>
                                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{job.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-light">Client: {job.client ? job.client.name : 'Unknown'}</span>
                                        <Button variant="primary" size="sm" onClick={() => handleAccept(job.id)}>Accept Job</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentDashboard;
