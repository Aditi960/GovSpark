import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../utils/api';

export default function NewChallenge() {
    const [rawText, setRawText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    const navigate = useNavigate();

    const handleAiTranslate = async () => {
        setIsTranslating(true);
        setAiResult(null);

        try {
            const response = await axios.post(apiUrl('/api/translate/'), {
                raw_text: rawText
            });
            setAiResult(response.data);
        } catch (error) {
            console.error("Error translating text:", error);
            alert("Failed to translate. Check backend server and API key.");
        } finally {
            setIsTranslating(false);
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            const newId = `CHL-2026-${Math.floor(Math.random() * 1000)}`;

            const payload = {
                id: newId,
                title: aiResult.title,
                department: "Maharashtra State Innovation Society",
                expected_outcome: aiResult.outcome,
                budget: "₹20 Lakhs",
                status: "Open for Proposals"
            };

            await axios.post(apiUrl('/api/challenges/'), payload);

            navigate('/challenges');
        } catch (error) {
            console.error("Error publishing challenge:", error);
            alert("Failed to publish challenge.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="max-w-4xl text-left">
            <h1 className="m-0 text-3xl mb-2">Draft New Challenge</h1>
            <p className="mb-8">Use our AI Translator to convert your operational problem into a startup-friendly brief.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Area */}
                <div className="flex flex-col gap-4">
                    <label className="font-medium text-[var(--text-h)]">Raw Departmental Problem</label>
                    <textarea
                        className="w-full h-48 p-4 bg-[var(--bg)] border border-[var(--border)] rounded focus:outline-none focus:border-accent resize-none"
                        placeholder="E.g., We have too many paper files moving between desks..."
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                    ></textarea>
                    <button
                        onClick={handleAiTranslate}
                        disabled={!rawText || isTranslating}
                        className="px-6 py-3 rounded bg-accent text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        {isTranslating ? 'AI is analyzing...' : '✨ Translate with AI'}
                    </button>
                </div>

                {/* Output Area */}
                <div className="p-6 border border-[var(--accent-border)] rounded bg-[var(--accent-bg)] flex flex-col gap-4">
                    <h2 className="text-lg text-accent flex items-center gap-2">
                        Structured Challenge Brief
                    </h2>

                    {aiResult ? (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider opacity-70">Proposed Title</span>
                                <p className="font-medium text-[var(--text-h)] text-lg">{aiResult.title}</p>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider opacity-70">Expected Outcome</span>
                                <p>{aiResult.outcome}</p>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider opacity-70">Pilot KPIs</span>
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-[var(--text-h)]">
                                    {aiResult.kpis && aiResult.kpis.map((kpi, idx) => <li key={idx}>{kpi}</li>)}
                                </ul>
                            </div>
                            <button
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="w-full mt-4 px-4 py-2 bg-[var(--code-bg)] border border-[var(--border)] rounded text-[var(--text-h)] hover:border-accent transition-colors disabled:opacity-50"
                            >
                                {isPublishing ? 'Publishing...' : 'Publish to Startups'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center opacity-50 border-2 border-dashed border-[var(--border)] rounded">
                            <p className="px-8 text-sm">Enter a problem on the left and let AI structure it for procurement compliance.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}