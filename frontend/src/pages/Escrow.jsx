import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Escrow() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/proposals/');
            setProposals(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching proposals:", error);
            setLoading(false);
        }
    };

    const releaseFunds = async (proposalId, milestoneIndex) => {
        const proposal = proposals.find(p => p.id === proposalId);
        const updatedMilestones = [...proposal.milestones];

        // Update the specific milestone to 'Released'
        updatedMilestones[milestoneIndex].status = "Released";

        try {
            await axios.patch(`http://127.0.0.1:8000/api/proposals/${proposalId}/`, {
                milestones: updatedMilestones,
                status: "Approved for Pilot" // Matches choices in models.py
            });

            alert("Smart Contract Triggered: Funds Released Successfully!");
            fetchProposals(); // Refresh UI
        } catch (error) {
            console.error("Error releasing funds:", error.response?.data || error);
            alert("Failed to release funds.");
        }
    };

    if (loading) return <div className="text-left">Loading active escrows...</div>;

    return (
        <div className="text-left">
            <div className="flex justify-between items-center mb-6">
                <h1 className="m-0 text-3xl">Smart Escrow Management</h1>
            </div>
            <p className="mb-8">Review startup pilot milestones and authorize blockchain-simulated fund releases.</p>

            {proposals.length === 0 ? (
                <p className="text-[var(--text)]">No active pilots or proposals found.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {proposals.map((proposal) => (
                        <div key={proposal.id} className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg)] shadow-custom">
                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-[var(--border)]">
                                <div>
                                    <h2 className="text-xl text-accent m-0 mb-1">{proposal.startup_name}</h2>
                                    <p className="text-sm font-mono bg-[var(--code-bg)] px-2 py-1 rounded inline-block">
                                        Challenge: {proposal.challenge}
                                    </p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded font-medium ${proposal.status === 'Approved for Pilot' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                    {proposal.status}
                                </span>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-70">Milestone Payment Triggers</h3>
                                <div className="flex flex-col gap-4">
                                    {proposal.milestones && proposal.milestones.map((milestone, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-[var(--social-bg)] border border-[var(--border)] rounded">
                                            <div>
                                                <p className="font-medium text-[var(--text-h)] m-0">{milestone.name}</p>
                                                <p className="text-sm m-0 mt-1">Amount Locked: ₹{(milestone.amount).toLocaleString()}</p>
                                            </div>

                                            {milestone.status === "Released" ? (
                                                <div className="flex items-center gap-4">
                                                    <span className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded flex items-center gap-2">
                                                        ✓ Funds Released
                                                    </span>
                                                    <a
                                                        href={`http://127.0.0.1:8000/api/proposals/${proposal.id}/agreement/`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 text-sm font-medium rounded bg-accent text-white hover:opacity-90 transition-opacity no-underline flex items-center gap-2"
                                                    >
                                                        📄 Download PDF Agreement
                                                    </a>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => releaseFunds(proposal.id, index)}
                                                    className="px-4 py-2 text-sm font-medium rounded bg-[var(--code-bg)] border border-[var(--border)] text-[var(--text-h)] hover:border-accent hover:text-accent transition-colors"
                                                >
                                                    Verify & Release Funds
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}