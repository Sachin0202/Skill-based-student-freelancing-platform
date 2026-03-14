import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MessageSquare, LayoutDashboard, User as UserIcon, LogOut } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <Briefcase size={24} className="text-primary" />
                    <span>SkillConnect</span>
                </Link>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link to={user.role === 'CLIENT' ? '/client' : '/student'}>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link to="/messages">
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    Messages
                                </Button>
                            </Link>
                            <Link to="/profile">
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <UserIcon size={16} />
                                    Profile
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50">
                                <LogOut size={16} />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary">Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
