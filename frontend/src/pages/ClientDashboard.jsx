import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { LayoutDashboard, PlusCircle, List } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    // Load Razorpay Script
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    const fetchData = React.useCallback(() => {
        if (user && user.id) {
            setLoading(true);
            fetch(`http://localhost:8080/api/jobs/client/${user.id}`)
                .then(res => res.json())
                .then(async (jobs) => {
                    if (Array.isArray(jobs)) {
                        setActivePostings(jobs);
                        // Only fetch submissions for jobs that actually have them
                        const submittedJobs = jobs.filter(j => j.status === 'SUBMITTED' || j.status === 'COMPLETED');
                        const subMap = {};
                        if (submittedJobs.length > 0) {
                            await Promise.all(submittedJobs.map(async (job) => {
                                try {
                                    const subRes = await fetch(`http://localhost:8080/api/submissions/job/${job.id}`);
                                    if (subRes.ok) {
                                        const subData = await subRes.ok ? await subRes.json() : [];
                                        subMap[job.id] = subData;
                                    }
                                } catch (e) {
                                    console.error("Failed to fetch sub for job", job.id);
                                }
                            }));
                        }
                        setSubmissions(subMap);
                    } else {
                        setActivePostings([]);
                    }
                })
                .catch(err => console.error("Failed to fetch jobs", err))
                .finally(() => setLoading(false));
        }
    }, [user]);

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
                                </div>
                            </div>

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
                                <p className="text-xs text-secondary mt-2">Freelancer: {post.freelancer.name} ({post.freelancer.email})</p>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default ClientDashboard;
