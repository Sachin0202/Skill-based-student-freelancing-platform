import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-center">
            <Navbar />
            <div className="container flex flex-col justify-center items-center" style={{ minHeight: '80vh' }}>
                <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-xl text-gray-600 mb-8">
                    You do not have permission to view this dashboard.
                </p>
                <div className="flex gap-4">
                    <Link to="/login">
                        <Button variant="outline">Switch Account</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="primary">Go Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
