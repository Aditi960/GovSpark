import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function StudentDashboard({ user }) {
    const [myProposals, setMyProposals] = useState([]);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/proposals/');
                // Filter proposals to show only this team's submissions
                // Using organization name or falling back to a demo filter
                const teamProposals = response.data.filter(p => p.startup_name.includes(user.organization || 'ReGen'));
                setMyProposals(teamProposals);
            } catch (error) {
                console.error("Error fetching student proposals:", error);
            }
        };
        fetchProposals();
    }, [user]);

    return (
        <div className="animate-fade-in text-left">
            <h1 className="mt-0 text-3xl">Student Innovator Portal</h1>
            <p className="mb-8 opacity-80">Welcome back, {user.name} | Team: {user.organization || 'ReGen Coders'}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 border border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/10 rounded-lg shadow-sm">
                    <h2 className="text-sm uppercase font-bold text-orange-700 dark:text-orange-400 tracking-wider mb-2">My Submissions</h2>
                    <p className="text-4xl font-bold m-0 text-[var(--text-h)]">{myProposals.length}</p>
                </div>
                <div className="p-6 border border-teal-200 bg-teal-50 dark:border-teal-900/50 dark:bg-teal-900/10 rounded-lg shadow-sm">
                    <h2 className="text-sm uppercase font-bold text-teal-700 dark:text-teal-400 tracking-wider mb-2">Approved Pilots</h2>
                    <p className="text-4xl font-bold m-0 text-[var(--text-h)]">
                        {myProposals.filter(p => p.status === 'Approved for Pilot').length}
                    </p>
                </div>
                <div className="p-6 border border-[var(--border)] bg-[var(--bg)] rounded-lg shadow-sm">
                    <h2 className="text-sm uppercase font-bold tracking-wider mb-2 opacity-70">Escrow Unlocked</h2>
                    <p className="text-4xl font-bold m-0 text-[var(--text-h)]">₹0</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Actions */}
                <div className="bg-[var(--code-bg)] p-6 rounded-lg border border-[var(--border)]">
                    <h3 className="text-xl mb-2 font-medium text-[var(--text-h)]">Find a Problem Statement</h3>
                    <p className="text-sm mb-4 opacity-80">Browse active challenges posted by Maharashtra Gov departments and submit your tech solution.</p>
                    <Link to="/challenges" className="inline-block px-6 py-2 bg-accent text-white font-medium rounded hover:opacity-90 transition-opacity">
                        Browse Problem Statements
                    </Link>
                </div>

                {/* Status Tracker */}
                <div>
                    <h3 className="text-xl mb-4 font-medium text-[var(--text-h)]">My Active Pilots</h3>
                    <div className="flex flex-col gap-3">
                        {myProposals.length > 0 ? (
                            myProposals.map(prop => (
                                <Link key={prop.id} to="/escrow" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded hover:border-accent flex justify-between items-center transition-colors">
                                    <div>
                                        <p className="font-medium text-sm m-0">Challenge: {prop.challenge}</p>
                                        <p className={`text-xs m-0 mt-1 font-medium ${prop.status === 'Approved for Pilot' ? 'text-green-500' : 'text-yellow-500'}`}>
                                            Status: {prop.status}
                                        </p>
                                    </div>
                                    <span className="text-accent">Track Funds →</span>
                                </Link>
                            ))
                        ) : (
                            <div className="p-4 border border-dashed border-[var(--border)] rounded text-center opacity-70 text-sm">
                                You haven't submitted any proposals yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}