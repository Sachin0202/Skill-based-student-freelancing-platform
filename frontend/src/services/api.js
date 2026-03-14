const BASE_URL = 'http://localhost:8080/api';

export const api = {
    // Auth
    login: async (email, password) => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    register: async (user) => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    // Jobs
    getJobs: async () => {
        const response = await fetch(`${BASE_URL}/jobs`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        return response.json();
    },

    createJob: async (job) => {
        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(job),
        });
        if (!response.ok) throw new Error('Failed to create job');
        return response.json();
    },

    // Submissions
    submitWork: async (formData) => {
        const response = await fetch(`${BASE_URL}/submissions`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to submit work');
        }
        return response.json();
    },

    approveJob: async (jobId) => {
        const response = await fetch(`${BASE_URL}/jobs/approve/${jobId}`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to approve job');
        return response.json();
    },

    createPayment: async (paymentData) => {
        const response = await fetch(`${BASE_URL}/payments/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });
        if (!response.ok) throw new Error('Payment failed');
        return response.json();
    },

    createRazorpayOrder: async (amount) => {
        const response = await fetch(`${BASE_URL}/payments/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
        });
        if (!response.ok) throw new Error('Failed to create Razorpay order');
        return response.json();
    },

    verifyRazorpayPayment: async (razorpayData) => {
        const response = await fetch(`${BASE_URL}/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(razorpayData),
        });
        if (!response.ok) throw new Error('Payment verification failed');
        return response.json();
    },

    // Messaging
    sendMessage: async (message) => {
        const response = await fetch(`${BASE_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    },

    getChatHistory: async (u1, u2) => {
        const response = await fetch(`${BASE_URL}/messages/history/${u1}/${u2}`);
        if (!response.ok) throw new Error('Failed to fetch chat history');
        return response.json();
    },

    // Reviews
    submitReview: async (review) => {
        const response = await fetch(`${BASE_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
        });
        if (!response.ok) throw new Error('Failed to submit review');
        return response.json();
    },

    getUserReviews: async (userId) => {
        const response = await fetch(`${BASE_URL}/reviews/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        return response.json();
    }
};
