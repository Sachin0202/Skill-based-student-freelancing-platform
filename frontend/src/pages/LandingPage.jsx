import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import './LandingPage.css';

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container" style={{ paddingTop: '2rem' }}>
                <section className="hero">
                    <div className="hero-content">
                        <h1>Skill-Based Student Freelancing Platform</h1>
                        <p>Explore opportunities, manage tasks, and make payments easily.</p>
                        {user && <p className="mt-4 text-primary font-bold">Welcome back, {user.name} ({user.role})</p>}
                    </div>
                </section>

                <section className="role-cards">
                    {/* Student Card */}
                    <Card className="role-card">
                        <div className="role-icon">
                            <GraduationCap size={32} />
                        </div>
                        <h3>Student</h3>
                        <p>Browse and accept freelance work for skill-building.</p>
                        {user && user.role !== 'STUDENT' ? (
                            <Button variant="outline" disabled style={{ width: '100%', opacity: 0.5 }}>Student Access Only</Button>
                        ) : (
                            <Link to="/student" style={{ width: '100%' }}>
                                <Button variant="primary" block>Go to Student Dashboard</Button>
                            </Link>
                        )}
                    </Card>

                    {/* Client Card */}
                    <Card className="role-card">
                        <div className="role-icon">
                            <Briefcase size={32} />
                        </div>
                        <h3>Client</h3>
                        <p>Post work and pay students efficiently online.</p>
                        {user && user.role !== 'CLIENT' ? (
                            <Button variant="outline" disabled style={{ width: '100%', opacity: 0.5 }}>Client Access Only</Button>
                        ) : (
                            <Link to="/client" style={{ width: '100%' }}>
                                <Button variant="secondary" block style={{ background: '#EFF6FF', color: 'var(--color-primary)', border: 'none' }}>Go to Client Dashboard</Button>
                            </Link>
                        )}
                    </Card>

                    {/* Admin Card */}
                    <Card className="role-card">
                        <div className="role-icon">
                            <Settings size={32} />
                        </div>
                        <h3>Admin</h3>
                        <p>Manage users, projects, and oversee platform activities.</p>
                        {user && user.role !== 'ADMIN' ? (
                            <Button variant="outline" disabled style={{ width: '100%', opacity: 0.5 }}>Admin Access Only</Button>
                        ) : (
                            <Link to="/admin" style={{ width: '100%' }}>
                                <Button variant="primary" block>Go to Admin Dashboard</Button>
                            </Link>
                        )}
                    </Card>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;
