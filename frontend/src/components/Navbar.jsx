import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <Briefcase size={24} className="text-primary" />
                    Skill-Based <span>Freelance</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/login">
                        <Button variant="outline">Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary">Register</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
