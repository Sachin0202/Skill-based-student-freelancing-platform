import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { LayoutDashboard, Briefcase, FileText, User, MessageCircle, Star, X } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Chat from '../components/Chat';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const StudentDashboard = () => {
    const links = [
        { label: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
        { label: 'Find Work', path: '/student/jobs', icon: <Briefcase size={20} /> },
        { label: 'My Work', path: '/student/work', icon: <FileText size={20} /> },
        { label: 'Profile', path: '/profile', icon: <User size={20} /> },
    ];

    const [availableJobs, setAvailableJobs] = React.useState([]);
    const [mySubmissions, setMySubmissions] = React.useState([]);
    const [myJobs, setMyJobs] = React.useState([]);
    const [myApplications, setMyApplications] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [activeChat, setActiveChat] = React.useState(null);
    const [reviewingJob, setReviewingJob] = React.useState(null);
    const [reviewData, setReviewData] = React.useState({ rating: 5, comment: '' });
    const location = useLocation();
    const isMyWork = location.pathname === '/student/work';

    const { user } = useAuth();

    React.useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        // Fetch My Submissions, My Jobs, Available Jobs AND My Applications
        const fetchSubmissions = fetch(`http://localhost:8080/api/submissions/student/${user.id}`).then(res => res.json());
        const fetchMyJobs = fetch(`http://localhost:8080/api/jobs/freelancer/${user.id}`).then(res => res.json());
        const fetchAvailable = fetch('http://localhost:8080/api/jobs').then(res => res.json());
        const fetchApplications = fetch(`http://localhost:8080/api/applications/student/${user.id}`).then(res => res.json());

        Promise.all([
            fetchSubmissions.catch(() => []),
            fetchMyJobs.catch(() => []),
            fetchAvailable.catch(() => []),
            fetchApplications.catch(() => [])
        ])
            .then(([subsData, myJobsData, availableData, appsData]) => {
                setMySubmissions(Array.isArray(subsData) ? subsData : []);
                setMyJobs(Array.isArray(myJobsData) ? myJobsData : []);
                setMyApplications(Array.isArray(appsData) ? appsData : []);
                setAvailableJobs(Array.isArray(availableData) ? availableData : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to fetch dashboard data");
                setLoading(false);
            });
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
                    <Button variant="secondary" size="sm" className="ml-4" onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleApply = async (jobId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/applications/apply/${jobId}/${user.id}`, { method: 'POST' });
            if (!res.ok) throw new Error("Failed to apply");
            const newApp = await res.json();
            if (newApp && newApp.id) {
                setMyApplications(prev => [...prev, newApp]);
            }
            alert("Application submitted! The client will review your profile.");
        } catch (e) {
            console.error(e);
            alert("Failed to apply for job");
        }
    };

    const isApplied = (jobId) => {
        if (!Array.isArray(myApplications)) return false;
        return myApplications.some(app => app.job?.id === jobId);
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
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setActiveChat({ target: job.client, jobId: job.id })}
                                        className="flex items-center gap-1"
                                    >
                                        <MessageCircle size={14} />
                                        Message
                                    </Button>
                                    {job.status === 'COMPLETED' && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setReviewingJob(job)}
                                            className="flex items-center gap-1"
                                        >
                                            <Star size={14} />
                                            Rate Client
                                        </Button>
                                    )}
                                </div>
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
                                        {isApplied(job.id) ? (
                                            <Button variant="secondary" size="sm" disabled>Applied</Button>
                                        ) : (
                                            <Button variant="primary" size="sm" onClick={() => handleApply(job.id)}>Apply</Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Chat Integration */}
            {activeChat && (
                <Chat
                    currentUserId={user.id}
                    targetUser={activeChat.target}
                    jobId={activeChat.jobId}
                    onClose={() => setActiveChat(null)}
                />
            )}

            {/* Review Modal Simple */}
            {reviewingJob && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100]">
                    <Card className="max-w-md w-full m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Rate {reviewingJob.client.name}</h3>
                            <button onClick={() => setReviewingJob(null)}><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            size={24}
                                            className={`cursor-pointer ${star <= reviewData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Comment</label>
                                <textarea
                                    className="w-full border rounded-md p-2 text-sm"
                                    rows="3"
                                    placeholder="Great client to work with!"
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                ></textarea>
                            </div>
                            <Button
                                variant="primary"
                                block
                                onClick={async () => {
                                    try {
                                        await api.submitReview({
                                            reviewer: { id: user.id },
                                            reviewee: { id: reviewingJob.client.id },
                                            job: { id: reviewingJob.id },
                                            rating: reviewData.rating,
                                            comment: reviewData.comment
                                        });
                                        alert("Review submitted!");
                                        setReviewingJob(null);
                                    } catch (err) {
                                        alert("Failed to submit review");
                                    }
                                }}
                            >
                                Submit Review
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentDashboard;
