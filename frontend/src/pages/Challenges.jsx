import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Challenges() {
    const [challenges, setChallenges] = useState([]);
    const [translations, setTranslations] = useState({});
    const [translatingId, setTranslatingId] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/challenges/')
            .then(res => setChallenges(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleTranslate = async (id, text) => {
        if (translations[id]) {
            // Toggle off if already translated
            const newTrans = { ...translations };
            delete newTrans[id];
            setTranslations(newTrans);
            return;
        }

        setTranslatingId(id);
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/marathi/', { text });
            setTranslations({ ...translations, [id]: res.data.marathi_text });
        } catch (error) {
            alert("Translation failed.");
        } finally {
            setTranslatingId(null);
        }
    };

    return (
        <div className="text-left animate-fade-in">
            <h1 className="mt-0 text-3xl mb-8">Active Problem Statements</h1>

            <div className="grid grid-cols-1 gap-6">
                {challenges.map(c => (
                    <div key={c.id} className="p-6 border border-[var(--border)] rounded-lg bg-[var(--bg)] shadow-custom">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl m-0 text-accent">{c.title}</h2>
                            <button
                                onClick={() => handleTranslate(c.id, `${c.title}. ${c.expected_outcome}`)}
                                disabled={translatingId === c.id}
                                className="px-3 py-1 text-xs border border-[var(--border)] rounded hover:bg-[var(--code-bg)] disabled:opacity-50"
                            >
                                {translatingId === c.id ? 'Translating...' : translations[c.id] ? 'Show English' : 'अ Translate to Marathi'}
                            </button>
                        </div>

                        {translations[c.id] ? (
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded mb-4">
                                <p className="text-sm m-0 leading-relaxed font-medium">{translations[c.id]}</p>
                            </div>
                        ) : (
                            <p className="text-sm opacity-90 mb-4">{c.expected_outcome}</p>
                        )}

                        <div className="flex gap-4 text-xs font-mono bg-[var(--code-bg)] p-3 rounded mb-4">
                            <span>Department: {c.department}</span>
                            <span>•</span>
                            <span>Budget: {c.budget}</span>
                        </div>

                        <Link
                            to={`/apply/${c.id}`}
                            className="inline-block px-4 py-2 bg-accent text-white font-medium rounded hover:opacity-90 no-underline text-sm"
                        >
                            Submit Proposal
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}