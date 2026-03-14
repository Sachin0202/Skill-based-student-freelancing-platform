import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { LayoutDashboard, PlusCircle, List, FileText, MessageCircle, Star } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Chat from '../components/Chat';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const ClientDashboard = () => {
    const { user } = useAuth();
    const links = [
        { label: 'Dashboard', path: '/client', icon: <LayoutDashboard size={20} /> },
        { label: 'Post Job', path: '/client/post', icon: <PlusCircle size={20} /> },
        { label: 'My Postings', path: '/client/jobs', icon: <List size={20} /> },
    ];

    const [activePostings, setActivePostings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [submissions, setSubmissions] = React.useState({});
    const [applications, setApplications] = React.useState({});
    const [activeChat, setActiveChat] = React.useState(null);
    const [reviewingJob, setReviewingJob] = React.useState(null);
    const [reviewData, setReviewData] = React.useState({ rating: 5, comment: '' });

    // Load Razorpay Script
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    const fetchData = React.useCallback(async () => {
        if (!user?.id) return;

        try {
            setLoading(true);
            const jobsRes = await fetch(`http://localhost:8080/api/jobs/client/${user.id}`);
            const jobs = await jobsRes.json();

            if (!Array.isArray(jobs)) {
                setActivePostings([]);
                setLoading(false);
                return;
            }

            setActivePostings(jobs);

            // Fetch Submissions and Applications in parallel
            const subMap = {};
            const appMap = {};

            await Promise.all(jobs.map(async (job) => {
                // Fetch Submissions for relevant jobs
                if (job.status === 'SUBMITTED' || job.status === 'COMPLETED') {
                    try {
                        const subRes = await fetch(`http://localhost:8080/api/submissions/job/${job.id}`);
                        if (subRes.ok) subMap[job.id] = await subRes.json();
                    } catch (e) {
                        console.error(`Sub fetch failed for job ${job.id}`, e);
                    }
                }

                // Fetch Applications for OPEN jobs
                if (job.status === 'OPEN') {
                    try {
                        const appRes = await fetch(`http://localhost:8080/api/applications/job/${job.id}`);
                        if (appRes.ok) appMap[job.id] = await appRes.json();
                    } catch (e) {
                        console.error(`App fetch failed for job ${job.id}`, e);
                    }
                }
            }));

            setSubmissions(subMap);
            setApplications(appMap);
        } catch (err) {
            console.error("Dashboard data fetch failed", err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApprove = async (jobId) => {
        try {
            await api.approveJob(jobId);
            alert("Job Approved!");
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to approve job. Check console for details.");
        }
    };

    const handlePay = async (job) => {
        try {
            // 1. Create Order on Backend
            const orderData = await api.createRazorpayOrder(job.budget);
            const { orderId } = orderData;

            // 2. Open Razorpay Checkout
            const options = {
                key: 'rzp_test_placeholder_id', // Should match backend key.id
                amount: job.budget * 100,
                currency: 'INR',
                name: 'Skill Based Platform',
                description: `Payment for ${job.title}`,
                order_id: orderId,
                handler: async (response) => {
                    try {
                        // 3. Verify Payment
                        await api.verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        // 4. Save Payment Record
                        const paymentData = {
                            amount: job.budget,
                            job: { id: job.id },
                            payer: { id: user.id },
                            payee: { id: job.freelancer.id },
                            transactionId: response.razorpay_payment_id
                        };
                        await api.createPayment(paymentData);

                        alert("Payment Successful!");
                        fetchData();
                    } catch (err) {
                        alert("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email
                },
                theme: {
                    color: '#3399cc'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Failed to initiate payment");
        }
    };

    const handleHire = async (applicationId) => {
        if (!window.confirm("Are you sure you want to hire this student?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/applications/hire/${applicationId}`, { method: 'POST' });
            if (res.ok) {
                alert("Student hired successfully!");
                fetchData();
            } else {
                alert("Failed to hire student.");
            }
        } catch (e) {
            console.error(e);
            alert("Error hiring student.");
        }
    };

    if (loading) {
        return (
            <DashboardLayout sidebarTitle="Client" sidebarLinks={links}>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <span className="ml-3 text-secondary">Loading your jobs...</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebarTitle="Client" sidebarLinks={links}>
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Client Dashboard</h1>
                    <p className="text-secondary">Post work and find talented students.</p>
                </div>
                <Link to="/client/post">
                    <Button variant="primary">Post New Job</Button>
                </Link>
            </header>

            <h2 className="text-xl font-bold mb-4">Your Postings</h2>
            {activePostings.length === 0 ? (
                <p className="text-gray-500">You haven't posted any jobs yet.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {activePostings.map((post) => (
                        <Card key={post.id}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{post.title}</h3>
                                    <p className="text-sm text-secondary">
                                        Status: <span className={`badge badge-${post.status ? post.status.toLowerCase().replace('_', '-') : 'open'}`}>{post.status}</span>
                                        <span className="mx-2">•</span>
                                        Budget: ${post.budget}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {post.status === 'SUBMITTED' && (
                                        <Button variant="primary" size="sm" onClick={() => handleApprove(post.id)}>Approve Work</Button>
                                    )}
                                    {post.status === 'COMPLETED' && (
                                        <Button variant="success" size="sm" onClick={() => handlePay(post)}>Pay Student</Button>
                                    )}
                                    {post.freelancer && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setActiveChat({ target: post.freelancer, jobId: post.id })}
                                            className="flex items-center gap-1"
                                        >
                                            <MessageCircle size={14} />
                                            Message
                                        </Button>
                                    )}
                                    {post.status === 'COMPLETED' && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setReviewingJob(post)}
                                            className="flex items-center gap-1"
                                        >
                                            <Star size={14} />
                                            Rate Student
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Show Applications if status is OPEN */}
                            {post.status === 'OPEN' && applications[post.id] && applications[post.id].length > 0 && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
                                    <h4 className="text-sm font-bold mb-3 text-blue-800">Interested Students:</h4>
                                    <div className="space-y-4">
                                        {applications[post.id].map(app => (
                                            <div key={app.id} className="p-3 bg-white rounded border border-blue-100 shadow-sm">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-sm">{app.student?.name || 'Unknown Student'}</p>
                                                        <p className="text-xs text-secondary mb-2">{app.student?.email || 'No email'}</p>
                                                        {app.student.skills && (
                                                            <div className="flex flex-wrap gap-1 mb-2">
                                                                {app.student.skills.split(',').map((skill, i) => (
                                                                    <span key={i} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">
                                                                        {skill.trim()}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {app.student.bio && (
                                                            <p className="text-xs text-light italic line-clamp-2">"{app.student.bio}"</p>
                                                        )}
                                                        {app.student.resumeUrl && (
                                                            <div className="mt-2">
                                                                <a
                                                                    href={`http://localhost:8080/uploads/${app.student.resumeUrl}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-[10px] text-primary hover:underline flex items-center gap-1"
                                                                >
                                                                    <FileText size={12} />
                                                                    View Resume
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button variant="primary" size="sm" onClick={() => handleHire(app.id)}>
                                                        Hire
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Show Submissions if any */}
                            {submissions[post.id] && submissions[post.id].length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-dashed">
                                    <h4 className="text-sm font-bold mb-2">Student Submissions:</h4>
                                    {submissions[post.id].map(sub => (
                                        <div key={sub.id} className="flex justify-between items-center text-sm">
                                            <span>File: <a href={`http://localhost:8080/uploads/${sub.workLink}`} target="_blank" rel="noreferrer" className="text-primary underline">{sub.workLink}</a></span>
                                            <span className="text-gray-400">{new Date(sub.submittedAt).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {post.freelancer && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {post.freelancer.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-primary">Assigned to: {post.freelancer.name}</p>
                                            <p className="text-[10px] text-secondary">{post.freelancer.email}</p>
                                        </div>
                                    </div>
                                    {post.freelancer.skills && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {post.freelancer.skills.split(',').map((skill, i) => (
                                                <span key={i} className="text-[9px] bg-primary/5 px-2 py-0.5 rounded text-primary/70">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
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
                            <h3 className="font-bold">Rate {reviewingJob.freelancer.name}</h3>
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
                                    placeholder="Great work!"
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
                                            reviewee: { id: reviewingJob.freelancer.id },
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

export default ClientDashboard;
