import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.register(formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            alert('Registration failed. Try again.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
                <Card title="Create an Account" style={{ width: '100%', maxWidth: '400px' }}>
                    <form onSubmit={handleRegister}>
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div style={{ margin: '1rem 0' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>I am a:</label>
                            <div className="flex gap-4" style={{ marginTop: '0.5rem' }}>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="STUDENT"
                                        checked={formData.role === 'STUDENT'}
                                        onChange={handleChange}
                                    /> Student
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="CLIENT"
                                        checked={formData.role === 'CLIENT'}
                                        onChange={handleChange}
                                    /> Client
                                </label>
                            </div>
                        </div>

                        <Button variant="primary" block style={{ marginTop: '1rem' }}>Register</Button>

                        <p className="text-center" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Login</Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
