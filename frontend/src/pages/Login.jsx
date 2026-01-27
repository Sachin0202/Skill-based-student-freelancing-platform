import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            alert(`Welcome back, ${user.name}!`);
            if (user.role === 'STUDENT') navigate('/student');
            else if (user.role === 'CLIENT') navigate('/client');
            else navigate('/admin');
        } catch (err) {
            alert('Login failed. Please check credentials.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
                <Card title="Login" style={{ width: '100%', maxWidth: '400px' }}>
                    <form onSubmit={handleLogin}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button variant="primary" block style={{ marginTop: '1rem' }}>Login</Button>

                        <p className="text-center" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                            Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)' }}>Register</Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
