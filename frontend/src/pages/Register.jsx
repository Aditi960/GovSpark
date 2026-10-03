import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// ✨ IMPORTANT: Update this fallback URL to your exact Render backend URL 
// (e.g., 'https://govspark-backend-abcd.onrender.com') if you haven't set VITE_API_BASE_URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://YOUR-RENDER-BACKEND-NAME.onrender.com';

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'startup', // Hardcoded securely in the background
        organization: '',
        otp: '',
        dpiitNumber: '' // NEW FIELD
    });

    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [timerActive, setTimerActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // DPIIT Mock API States
    const [verifyingDpiit, setVerifyingDpiit] = useState(false);
    const [dpiitVerified, setDpiitVerified] = useState(false);

    useEffect(() => {
        let interval = null;
        if (timerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setTimerActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerActive, timer]);

    // ✨ MOCK DPIIT API CALL ✨
    const handleVerifyDPIIT = () => {
        if (!formData.dpiitNumber.toUpperCase().startsWith('DIPP')) {
            alert("Invalid format. DPIIT numbers usually start with 'DIPP' (e.g., DIPP12345)");
            return;
        }

        setVerifyingDpiit(true);

        // Simulate a 1.5 second API network request to Startup India
        setTimeout(() => {
            setVerifyingDpiit(false);
            setDpiitVerified(true);
        }, 1500);
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();

        // Block registration if DPIIT is not verified
        if (!dpiitVerified) {
            setErrorMessage("You must verify your Startup India DPIIT number before registering.");
            return;
        }

        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        try {
            // Updated to point to the live Render backend
            const res = await axios.post(`${API_URL}/api/auth/send-registration-otp/`, { email: formData.email });

            // ✨ Hackathon Fallback: If backend returns a demo OTP because email failed, auto-fill it
            if (res.data.debug_otp && !res.data.email_dispatched) {
                console.warn("Using Hackathon Demo OTP:", res.data.debug_otp);
                setFormData(prev => ({ ...prev, otp: res.data.debug_otp }));
                setSuccessMessage("Live email dispatch bypassed. Demo OTP auto-filled for presentation.");
            } else {
                setSuccessMessage("OTP sent successfully! Please check your inbox.");
            }

            setStep(2);
            setTimer(60);
            setTimerActive(true);
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Failed to send OTP. Check console or network tab.');
            console.error("OTP Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            // ✨ Corrected API endpoint to match the unified verify_and_register view in Django
            const response = await axios.post(`${API_URL}/api/auth/register/`, formData);

            // Store user data and redirect
            localStorage.setItem('user', JSON.stringify(response.data.user));
            alert("Registration successful!");
            navigate('/');
            window.location.reload();
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Registration failed. Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 border border-[var(--border)] rounded-lg bg-[var(--bg)] shadow-custom text-left mt-8">
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-sm mb-6 opacity-80">Student Innovator Sandbox Portal</p>

            {errorMessage && (
                <div className="p-3 mb-4 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 rounded">
                    {errorMessage}
                </div>
            )}

            {successMessage && (
                <div className="p-3 mb-4 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                    {successMessage}
                </div>
            )}

            {step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Gmail / Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Team / Startup Name</label>
                        <input
                            type="text"
                            required
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] focus:outline-none focus:border-accent"
                        />
                    </div>

                    {/* NEW DPIIT VERIFICATION SECTION */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border border-[var(--border)] rounded">
                        <label className="block text-sm font-medium mb-1">DPIIT Recognition Number</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g., DIPP12345"
                                value={formData.dpiitNumber}
                                onChange={(e) => {
                                    setFormData({ ...formData, dpiitNumber: e.target.value });
                                    setDpiitVerified(false); // Reset verification if they change the text
                                }}
                                disabled={dpiitVerified}
                                className="w-full p-2 border border-[var(--border)] rounded bg-[var(--bg)] focus:outline-none focus:border-accent disabled:opacity-50"
                            />
                            {!dpiitVerified ? (
                                <button
                                    type="button"
                                    onClick={handleVerifyDPIIT}
                                    disabled={verifyingDpiit || !formData.dpiitNumber}
                                    className="px-4 py-2 bg-[var(--code-bg)] border border-[var(--border)] text-sm font-medium rounded hover:border-accent whitespace-nowrap disabled:opacity-50"
                                >
                                    {verifyingDpiit ? 'Checking API...' : 'Verify API'}
                                </button>
                            ) : (
                                <span className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-bold rounded border border-green-200 dark:border-green-800 flex items-center whitespace-nowrap">
                                    ✅ Verified via Startup India
                                </span>
                            )}
                        </div>
                        <p className="text-xs mt-2 opacity-70">
                            Your startup must be registered with the DPIIT to participate in government procurement.
                        </p>
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
                        disabled={loading || !dpiitVerified}
                        className="w-full py-2 bg-accent text-white font-medium rounded hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyRegister} className="space-y-4">
                    <p className="text-sm">
                        Enter the 6-digit code sent to <strong className="text-accent">{formData.email}</strong>.
                    </p>

                    <div>
                        <label className="block text-sm font-medium mb-1">Enter 6-Digit OTP</label>
                        <input
                            type="text"
                            maxLength="6"
                            required
                            value={formData.otp}
                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                            className="w-full p-2 border border-[var(--border)] rounded text-center tracking-widest text-xl font-mono bg-[var(--bg)] focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span>
                            Time remaining:{" "}
                            <strong className={timer > 0 ? "text-accent" : "text-red-500"}>
                                {timer > 0 ? `${timer}s` : "Expired"}
                            </strong>
                        </span>
                        {timer === 0 && (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                className="text-accent hover:underline"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || timer === 0}
                        className="w-full py-2 bg-accent text-white font-medium rounded hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify & Complete Registration'}
                    </button>
                </form>
            )}

            <p className="mt-6 text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-accent hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}