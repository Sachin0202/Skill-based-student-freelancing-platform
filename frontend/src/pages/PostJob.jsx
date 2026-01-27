import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState({
        title: '',
        description: '',
        budget: '',
        status: 'OPEN',
        client: null
    });

    useEffect(() => {
        if (user) {
            setJob(prev => ({ ...prev, client: { id: user.id } }));
        }
    }, [user]);

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedJob = {
                ...job,
                budget: parseFloat(job.budget) || 0
            };
            await api.createJob(formattedJob);
            alert('Job Posted Successfully!');
            navigate('/client');
        } catch (err) {
            console.error(err);
            alert('Failed to post job. Please ensure all fields are correct.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
                <Card title="Post a New Job" style={{ width: '100%', maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Job Title"
                            name="title"
                            placeholder="e.g. Logo Design"
                            value={job.title}
                            onChange={handleChange}
                        />
                        <div className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                className="w-full p-2 border rounded-md"
                                rows="4"
                                value={job.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <Input
                            label="Budget"
                            name="budget"
                            type="number"
                            placeholder="500"
                            value={job.budget}
                            onChange={handleChange}
                        />

                        <Button variant="primary" block className="mt-4">Post Job</Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default PostJob;
