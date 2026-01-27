import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SubmitWork = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [file, setFile] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobId', jobId);
        formData.append('studentId', user.id); // Real Student ID from Auth

        try {
            const res = await api.submitWork(formData);
            alert('Work Submitted Successfully!');
            navigate('/student/work');
        } catch (err) {
            console.error(err);
            // Optionally try to parse the error message if it's a response body
            alert(`Failed to submit work: ${err.message || 'Unknown error'}`);
        }
    };

    // Helper for input change
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container flex justify-center items-center" style={{ minHeight: '80vh' }}>
                <Card style={{ width: '100%', maxWidth: '600px', textAlign: 'center', padding: '3rem' }}>
                    <h1 className="text-2xl font-bold mb-2">Submit Work</h1>
                    <p className="text-secondary mb-8">Submit your completed work for the client</p>

                    <form onSubmit={handleSubmit}>
                        <div className="text-left mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Your Work (PDF, Zip, Image)</label>
                            <input
                                type="file"
                                className="w-full p-2 border rounded-md"
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        <Button variant="primary" block>Submit Work</Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default SubmitWork;
