import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SubmitProposal() {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [solution, setSolution] = useState('');
    const [aiDraft, setAiDraft] = useState('');
    const [drafting, setDrafting] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/challenges/${challengeId}/`)
            .then(res => setChallenge(res.data))
            .catch(err => console.error(err));
    }, [challengeId]);

    const handleAskAI = async () => {
        setDrafting(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/challenges/${challengeId}/draft/`);
            setAiDraft(res.data.draft);
        } catch (error) {
            alert("AI Drafting failed.");
        } finally {
            setDrafting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Retrieve user from local storage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : { organization: 'ReGen Coders' };

        const payload = {
            challenge: challengeId,
            startup_name: user.organization || user.name,
            solution_details: solution,
            status: "Submitted",
            milestones: [
                { name: "Phase 1: Prototype Development", amount: 450000, status: "Pending" },
                { name: "Phase 2: Live Deployment", amount: 850000, status: "Pending" }
            ]
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/proposals/', payload);
            alert("Proposal submitted successfully!");
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Submission failed. Check backend logs.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!challenge) return <div className="text-center p-8 opacity-50">Loading Challenge...</div>;

    return (
        <div className="max-w-2xl mx-auto text-left animate-fade-in mt-8">
            <h1 className="text-3xl m-0 mb-2">Submit Proposal</h1>
            <p className="text-sm opacity-80 mb-8">Targeting: <strong className="text-accent">{challenge.title}</strong></p>

            <div className="p-4 bg-[var(--social-bg)] border border-[var(--border)] rounded mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-70">Expected Outcome</h3>
                <p className="text-sm m-0 leading-relaxed">{challenge.expected_outcome}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="block text-sm font-medium">Technical Solution Architecture</label>
                        <button
                            type="button"
                            onClick={handleAskAI}
                            disabled={drafting}
                            className="text-xs px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded border border-purple-200 dark:border-purple-800 hover:opacity-80 disabled:opacity-50 flex items-center gap-2"
                        >
                            {drafting ? 'Thinking...' : '✨ Ask AI for Ideas'}
                        </button>
                    </div>

                    {aiDraft && (
                        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-500 rounded text-sm">
                            <strong className="block mb-2 text-purple-700 dark:text-purple-400">Gemini's Suggestions:</strong>
                            <div className="whitespace-pre-line opacity-90">{aiDraft}</div>
                            <button
                                type="button"
                                onClick={() => setSolution(aiDraft)}
                                className="mt-3 text-xs font-medium text-purple-600 hover:underline"
                            >
                                Use this template
                            </button>
                        </div>
                    )}

                    <textarea
                        required
                        rows="8"
                        placeholder="Describe your tech stack, database schema, and deployment strategy..."
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        className="w-full p-4 border border-[var(--border)] rounded bg-[var(--bg)] focus:outline-none focus:border-accent resize-none font-mono text-sm leading-relaxed"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-accent text-white font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    {submitting ? 'Submitting to Smart Escrow...' : 'Submit Final Proposal'}
                </button>
            </form>
        </div>
    );
}