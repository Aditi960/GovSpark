import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 border border-[var(--border)] rounded-lg bg-[var(--bg)] shadow-custom text-left mt-8">
            <h1 className="text-2xl font-bold mb-2">Sign In</h1>
            <p className="text-sm mb-6 opacity-80">Access your ProcureNova account</p>

            {errorMessage && (
                <div className="p-3 mb-4 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 rounded">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] focus:outline-none focus:border-accent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] focus:outline-none focus:border-accent"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-accent text-white font-medium rounded hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <p className="mt-6 text-sm text-center">
                Don't have an account?{" "}
                <Link to="/register" className="text-accent hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}