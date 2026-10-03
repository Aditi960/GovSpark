import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AuditLedger() {
    const [ledgerEntries, setLedgerEntries] = useState([]);

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/proposals/');
                const entries = [];

                response.data.forEach(proposal => {
                    proposal.milestones.forEach(ms => {
                        if (ms.status === 'Released' && ms.hash) {
                            entries.push({
                                startup: proposal.startup_name,
                                challenge: proposal.challenge,
                                amount: ms.amount,
                                milestone: ms.name,
                                hash: ms.hash,
                                date: new Date().toLocaleDateString() // Using current date for demo
                            });
                        }
                    });
                });

                setLedgerEntries(entries);
            } catch (error) {
                console.error("Error fetching ledger:", error);
            }
        };
        fetchLedger();
    }, []);

    return (
        <div className="animate-fade-in text-left">
            <h1 className="mt-0 text-3xl">Cryptographic Audit Ledger</h1>
            <p className="mb-8 opacity-80">Immutable SHA-256 blockchain records of all disbursed smart escrow funds.</p>

            {ledgerEntries.length === 0 ? (
                <div className="p-8 border border-dashed border-[var(--border)] rounded text-center opacity-70">
                    No funds have been disbursed yet. Execute a smart escrow release to generate a hash.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] bg-[var(--code-bg)]">
                                <th className="p-4 font-bold text-sm">Startup</th>
                                <th className="p-4 font-bold text-sm">Milestone</th>
                                <th className="p-4 font-bold text-sm">Amount</th>
                                <th className="p-4 font-bold text-sm">SHA-256 Cryptographic Hash</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledgerEntries.map((entry, idx) => (
                                <tr key={idx} className="border-b border-[var(--border)] hover:bg-[var(--social-bg)] transition-colors">
                                    <td className="p-4 text-sm font-medium">{entry.startup}</td>
                                    <td className="p-4 text-sm opacity-90">{entry.milestone}</td>
                                    <td className="p-4 text-sm font-bold text-green-500">₹{entry.amount.toLocaleString()}</td>
                                    <td className="p-4 text-xs font-mono text-accent truncate max-w-xs" title={entry.hash}>
                                        {entry.hash}
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