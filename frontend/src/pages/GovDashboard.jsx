import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function GovDashboard({ user }) {
    const [stats, setStats] = useState({ challenges: 0, proposals: 0 });
    const [recentProposals, setRecentProposals] = useState([]);
    const [evaluatingId, setEvaluatingId] = useState(null);
    const [scanningDpdpId, setScanningDpdpId] = useState(null);
    const [dpdpResults, setDpdpResults] = useState({});
    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);
    // ✨ NEW: State for Trust Scores
    const [trustScores, setTrustScores] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [chalRes, propRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/challenges/'),
                    axios.get('http://127.0.0.1:8000/api/proposals/')
                ]);

                setStats({
                    challenges: chalRes.data.length,
                    proposals: propRes.data.length
                });
                setRecentProposals(propRes.data.slice(0, 3));

                // ✨ NEW: Fetch Trust Scores for these recent proposals
                const scores = {};
                for (let prop of propRes.data.slice(0, 3)) {
                    if (!scores[prop.startup_name]) {
                        try {
                            const res = await axios.get(`http://127.0.0.1:8000/api/startups/${prop.startup_name}/trust/`);
                            scores[prop.startup_name] = res.data;
                        } catch (err) {
                            console.error("Failed to fetch trust score", err);
                        }
                    }
                }
                setTrustScores(scores);

                // Process data for Recharts
                const statusCounts = { 'Submitted': 0, 'Under Review': 0, 'Approved for Pilot': 0, 'Rejected': 0 };
                const challengeCounts = {};

                propRes.data.forEach(p => {
                    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
                    const cName = `Chal-${p.challenge}`;
                    challengeCounts[cName] = (challengeCounts[cName] || 0) + 1;
                });

                setPieData(Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] })).filter(d => d.value > 0));
                setChartData(Object.keys(challengeCounts).map(key => ({ name: key, Proposals: challengeCounts[key] })));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
    }, []);

    const handleEvaluateAI = async (id) => {
        setEvaluatingId(id);
        try {
            const res = await axios.post(`http://127.0.0.1:8000/api/proposals/${id}/evaluate/`);
            setRecentProposals(recentProposals.map(p =>
                p.id === id ? { ...p, ai_score: res.data.score, ai_summary: res.data.summary } : p
            ));
        } catch (error) {
            alert("AI Evaluation failed. Check server logs.");
        } finally {
            setEvaluatingId(null);
        }
    };

    const handleDpdpScan = async (id) => {
        setScanningDpdpId(id);
        try {
            const res = await axios.post(`http://127.0.0.1:8000/api/proposals/${id}/dpdp-scan/`);
            setDpdpResults(prev => ({ ...prev, [id]: res.data }));
        } catch (error) {
            alert("DPDP Scan failed.");
        } finally {
            setScanningDpdpId(null);
        }
    };

    return (
        <div className="animate-fade-in text-left">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="mt-0 text-3xl">Govt. Administration Portal</h1>
                    <p className="m-0 opacity-80">Nodal Officer: {user.name} | Maharashtra State Innovation Society</p>
                </div>
                <a href="http://127.0.0.1:8000/api/reports/export/" download className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors no-underline flex items-center gap-2">
                    📊 Download CSV Report
                </a>
            </div>

            {/* High-Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 border border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10 rounded-lg shadow-sm">
                    <h2 className="text-sm uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider mb-2">Total Challenges</h2>
                    <p className="text-4xl font-bold m-0 text-[var(--text-h)]">{stats.challenges}</p>
                </div>
                <div className="p-6 border border-purple-200 bg-purple-50 dark:border-purple-900/50 dark:bg-purple-900/10 rounded-lg shadow-sm">
                    <h2 className="text-sm uppercase font-bold text-purple-700 dark:text-purple-400 tracking-wider mb-2">Student Proposals</h2>
                    <p className="text-4xl font-bold m-0 text-[var(--text-h)]">{stats.proposals}</p>
                </div>
                <div className="p-6 border border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10 rounded-lg shadow-sm">
                    <h2 className="text-sm uppercase font-bold text-green-700 dark:text-green-400 tracking-wider mb-2">Escrow Disbursed</h2>
                    <p className="text-4xl font-bold m-0 text-[var(--text-h)]">₹450,000</p>
                </div>
            </div>

            {/* Interactive Recharts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="p-6 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Proposals by Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="p-6 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Proposals per Challenge</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="Proposals" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Evaluation Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl mb-4 font-medium text-[var(--text-h)]">Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                        <Link to="/new-challenge" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded hover:border-accent flex justify-between items-center transition-colors">
                            <span className="font-medium">✨ Draft AI Challenge</span>
                            <span className="text-accent">→</span>
                        </Link>
                        <Link to="/escrow" className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded hover:border-accent flex justify-between items-center transition-colors">
                            <span className="font-medium">🔒 Review Smart Escrow Releases</span>
                            <span className="text-accent">→</span>
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl mb-4 font-medium text-[var(--text-h)]">AI Proposal Evaluation</h3>
                    <div className="flex flex-col gap-4">
                        {recentProposals.length > 0 ? (
                            recentProposals.map(prop => (
                                <div key={prop.id} className="p-4 bg-[var(--social-bg)] border border-[var(--border)] rounded">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            {/* ✨ NEW: Trust Score Badge integrated with the Startup Name */}
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm m-0 text-[var(--text-h)]">{prop.startup_name}</p>
                                                {trustScores[prop.startup_name] && (
                                                    <span
                                                        className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full flex items-center gap-1 cursor-help ${trustScores[prop.startup_name].color === 'green' ? 'bg-green-100 text-green-700 border border-green-300' :
                                                                trustScores[prop.startup_name].color === 'blue' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                                                                    'bg-gray-100 text-gray-700 border border-gray-300'
                                                            }`}
                                                        title={`${trustScores[prop.startup_name].completed_milestones} past milestones completed successfully.`}
                                                    >
                                                        ⭐ Trust Score: {trustScores[prop.startup_name].trust_score}/100
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs opacity-70 m-0 mt-1">Challenge ID: {prop.challenge}</p>
                                        </div>
                                        {prop.ai_score ? (
                                            <span className="px-2 py-1 text-xs font-bold rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                AI Match: {prop.ai_score}%
                                            </span>
                                        ) : (
                                            <button onClick={() => handleEvaluateAI(prop.id)} disabled={evaluatingId === prop.id} className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">
                                                {evaluatingId === prop.id ? 'Scoring...' : '✨ Score with AI'}
                                            </button>
                                        )}
                                    </div>

                                    {prop.ai_summary && (
                                        <div className="mt-2 space-y-2">
                                            <p className="text-xs m-0 p-2 bg-[var(--bg)] rounded border border-purple-200 dark:border-purple-900 text-[var(--text)] italic">
                                                " {prop.ai_summary} "
                                            </p>

                                            {/* GeM Scale-Up Button */}
                                            <a
                                                href={`http://127.0.0.1:8000/api/proposals/${prop.id}/gem-export/`}
                                                download
                                                className="inline-flex w-full justify-center px-3 py-1.5 text-xs bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors no-underline items-center gap-2 mt-2"
                                            >
                                                🏛️ Generate GeM Scale-Up Package
                                            </a>

                                            {/* DPDP Compliance Scanner UI */}
                                            <div className="mt-4 p-3 border border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/10 rounded">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-orange-800 dark:text-orange-400">DPDP Act 2023 Compliance</span>
                                                    {!dpdpResults[prop.id] ? (
                                                        <button
                                                            onClick={() => handleDpdpScan(prop.id)}
                                                            disabled={scanningDpdpId === prop.id}
                                                            className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                                                        >
                                                            {scanningDpdpId === prop.id ? 'Scanning...' : '🛡️ Run AI Privacy Audit'}
                                                        </button>
                                                    ) : (
                                                        <span className={`px-2 py-1 text-xs font-bold rounded ${dpdpResults[prop.id].risk_level === 'Low' ? 'bg-green-100 text-green-700' :
                                                            dpdpResults[prop.id].risk_level === 'High' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            Risk: {dpdpResults[prop.id].risk_level}
                                                        </span>
                                                    )}
                                                </div>
                                                {dpdpResults[prop.id] && (
                                                    <p className="text-xs m-0 opacity-80 mt-2">
                                                        {dpdpResults[prop.id].summary}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm opacity-70">No recent submissions to review.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}