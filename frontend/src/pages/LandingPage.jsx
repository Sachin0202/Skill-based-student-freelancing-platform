import React from 'react';
import { Link } from 'react-router-dom';
import {
    UserPlus,
    Search,
    CheckCircle,
    Code,
    Palette,
    FileText,
    Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import heroImage from '../assets/hero_illustration.png';
import './LandingPage.css';

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="landing-page">
            <Navbar />

            {/* Hero Section */}
            <header className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Find Freelance Projects <br />
                            <span>Based on Your Skills</span>
                        </h1>
                        <p className="hero-subtitle">
                            A platform where students showcase their skills,
                            work on real projects, and build professional experience.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register">
                                <Button variant="primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src={heroImage} alt="Students working" />
                    </div>
                </div>
            </header>

            {/* How It Works Section */}
            <section className="section how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="grid grid-3">
                        <div className="step-card">
                            <div className="step-icon">
                                <UserPlus size={32} />
                            </div>
                            <h3>Create Profile</h3>
                            <p>Add your skills and portfolio.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-icon">
                                <Search size={32} />
                            </div>
                            <h3>Find Projects</h3>
                            <p>Browse freelance jobs.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-icon">
                                <CheckCircle size={32} />
                            </div>
                            <h3>Get Hired</h3>
                            <p>Complete tasks & earn ratings.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Skills Section */}
            <section className="section popular-skills">
                <div className="container">
                    <h2 className="section-title">Popular Skills</h2>
                    <div className="grid grid-4">
                        <div className="skill-card">
                            <div className="skill-icon">
                                <Code size={32} />
                            </div>
                            <p>Web Development</p>
                        </div>
                        <div className="skill-card">
                            <div className="skill-icon">
                                <Palette size={32} />
                            </div>
                            <p>Graphic Design</p>
                        </div>
                        <div className="skill-card">
                            <div className="skill-icon">
                                <FileText size={32} />
                            </div>
                            <p>Content Writing</p>
                        </div>
                        <div className="skill-card">
                            <div className="skill-icon">
                                <Video size={32} />
                            </div>
                            <p>Video Editing</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="section community-section">
                <div className="container">
                    <div className="community-banner">
                        <h2>Join the Community!</h2>
                        <p>Start your freelance journey today!</p>
                        <div className="community-actions">
                            <Link to="/register">
                                <Button variant="light">Join as Student</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" style={{ borderColor: 'white', color: 'white' }}>Hire Students</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>© 2025 SkillConnect | Student Freelancing Platform</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
