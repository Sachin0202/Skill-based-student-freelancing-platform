import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Mail, FileText, Save } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        skills: '',
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                skills: user.skills || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            setMessage({ type: 'error', text: 'User session not found. Please re-login.' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('bio', formData.bio);
            data.append('skills', formData.skills);
            if (resumeFile) {
                data.append('resume', resumeFile);
            }

            const response = await fetch(`http://localhost:8080/api/users/${user.id}/profile`, {
                method: 'PUT',
                body: data,
                // Do not set Content-Type header when using FormData, 
                // the browser will set it with the correct boundary
            });

            if (response.ok) {
                const updatedUser = await response.json();
                // Update user in context
                if (setUser) {
                    setUser(updatedUser);
                    // Also update localStorage to persist across refreshes
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    setMessage({ type: 'success', text: 'Profile updated successfully!' });
                } else {
                    console.error('setUser is not defined in useAuth()');
                    setMessage({ type: 'error', text: 'Context update failed. Please refresh.' });
                }
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const links = [
        { label: 'Dashboard', path: '/student', icon: <User size={20} /> },
        { label: 'Find Work', path: '/student/jobs', icon: <FileText size={20} /> },
        { label: 'My Work', path: '/student/work', icon: <FileText size={20} /> },
    ];

    return (
        <DashboardLayout sidebarTitle="Student" sidebarLinks={links}>
            <header className="mb-8">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-secondary">Manage your personal information, skills, and resume.</p>
            </header>

            <div className="max-w-2xl">
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message.text && (
                            <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-secondary">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-light" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-secondary">Email (read-only)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-light" size={18} />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    className="input-field pl-10 bg-gray-50 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-secondary">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="input-field min-h-[120px] py-2"
                                placeholder="Tell us about yourself and your experience..."
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-secondary">Skills (comma separated)</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-4 text-light" size={18} />
                                <textarea
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    className="input-field pl-10 py-2 min-h-[80px]"
                                    placeholder="e.g. React, Node.js, Python, UI Design"
                                />
                            </div>
                            <p className="text-xs text-light mt-1">Clients will see these skills when you apply for jobs.</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-secondary">Resume (PDF or Doc)</label>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx"
                                    className="text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                {user?.resumeUrl && (
                                    <div className="flex items-center gap-2 text-primary text-sm mt-1">
                                        <FileText size={16} />
                                        <a
                                            href={`http://localhost:8080/uploads/${user.resumeUrl}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="underline font-medium"
                                        >
                                            View Current Resume
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" variant="primary" disabled={loading}>
                                <Save size={18} className="mr-2" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
