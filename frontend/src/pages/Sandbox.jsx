import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { apiUrl } from '../utils/api';

export default function Sandbox() {
    const [approvedPilots, setApprovedPilots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPilots = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : { organization: 'ReGen Coders' };

                const response = await axios.get(apiUrl('/api/proposals/'));
                const myApproved = response.data.filter(p =>
                    p.startup_name.includes(user.organization || user.name) &&
                    p.status === 'Approved for Pilot'
                );

                setApprovedPilots(myApproved);
            } catch (error) {
                console.error("Error fetching sandbox data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPilots();
    }, []);

    if (loading) return <div className="p-8 opacity-50">Loading Secure Sandbox...</div>;

    return (
        <div className="animate-fade-in text-left">
            <div className="flex items-center gap-3 mb-2">
                <h1 className="mt-0 text-3xl m-0">Virtual Sandbox Gateway</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800">
                    🔒 Encrypted Container
                </span>
            </div>
            <p className="mb-8 opacity-80">Access anonymized government datasets safely for approved pilot testing.</p>

            {approvedPilots.length === 0 ? (
                <div className="p-12 border border-dashed border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-900/50 rounded-lg text-center">
                    <h2 className="text-xl text-red-600 dark:text-red-400 mb-2">Access Denied</h2>
                    <p className="opacity-80 text-sm">You do not have any active, approved pilot programs. The sandbox is locked.</p>
                    <Link to="/challenges" className="inline-block mt-4 text-accent hover:underline text-sm font-medium">
                        Apply for challenges to gain access →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {approvedPilots.map(pilot => (
                        <div key={pilot.id} className="p-6 bg-[var(--code-bg)] border border-[var(--border)] rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl m-0 text-[var(--text-h)]">Challenge ID: {pilot.challenge}</h3>
                                    <p className="text-sm opacity-70 m-0 mt-1">Status: Active Pilot Container</p>
                                </div>
                                <a
                                    href={apiUrl(`/api/proposals/${pilot.id}/sandbox/`)}
                                    className="px-4 py-2 bg-accent text-white text-sm font-medium rounded hover:opacity-90 transition-opacity no-underline flex items-center gap-2"
                                >
                                    ⬇️ Download Anonymized CSV
                                </a>
                            </div>

                            <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded text-sm font-mono opacity-80">
                                <p className="m-0 mb-1 text-green-600 dark:text-green-400"># SANDBOX ENVIRONMENT LOGS</p>
                                <p className="m-0 mb-1">&gt; Initiating secure data tunnel...</p>
                                <p className="m-0 mb-1">&gt; Masking PII (Personally Identifiable Information)...</p>
                                <p className="m-0 mb-1">&gt; Stripping Geolocation metadata...</p>
                                <p className="m-0">&gt; Dataset ready for localized testing.</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}