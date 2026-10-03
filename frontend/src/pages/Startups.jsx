import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Startups() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/startups/')
            .then(response => {
                setStartups(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching startups:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-left">Loading startups...</div>;

    return (
        <div>
            <h1 className="text-left m-0 text-3xl mb-6">Startup Directory</h1>

            {startups.length === 0 ? (
                <p className="text-left text-[var(--text)]">No startups found. Add some in the Django Admin panel.</p>
            ) : (
                <div className="overflow-x-auto border border-[var(--border)] rounded-lg shadow-custom">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--code-bg)] border-b border-[var(--border)]">
                                <th className="p-4 font-medium text-[var(--text-h)]">Startup Name</th>
                                <th className="p-4 font-medium text-[var(--text-h)]">Domain Focus</th>
                                <th className="p-4 font-medium text-[var(--text-h)]">Gov Pilots Completed</th>
                                <th className="p-4 font-medium text-[var(--text-h)]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {startups.map((startup) => (
                                <tr key={startup.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--social-bg)] transition-colors">
                                    <td className="p-4 font-medium text-accent">{startup.name}</td>
                                    <td className="p-4">{startup.domain_focus}</td>
                                    <td className="p-4 font-mono">{startup.pilots_completed}</td>
                                    <td className="p-4">
                                        {startup.is_dpiit_verified ? (
                                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">DPIIT Verified</span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}