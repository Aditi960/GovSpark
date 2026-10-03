import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="animate-fade-in text-left">
            {/* Official Government Top Bar */}
            <div className="w-full bg-orange-50 border-b border-orange-200 py-1 px-4 flex justify-between items-center text-[10px] uppercase font-bold text-orange-800 tracking-wider">
                <span>🇮🇳 Government of Maharashtra</span>
                <span>Maharashtra State Innovation Society (MSINS)</span>
            </div>

            {/* Main Hero Section */}
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white rounded-b-3xl p-12 md:p-20 shadow-xl mb-12 relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl">
                    <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full border border-white/30 backdrop-blur-sm inline-block mb-6 uppercase tracking-widest">
                        SIH 2026 • Problem 26136
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Agile Public Procurement for <span className="text-orange-400">Startups</span>
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 mb-10 leading-relaxed max-w-2xl font-light">
                        GovSpark bridges the gap between government operational challenges and startup innovation. Secure pilots, AI-driven evaluation, and smart escrow payments—all fully compliant with DPDP Act 2023.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/register" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-transform hover:scale-105 shadow-lg flex items-center gap-2">
                            Apply as Startup Innovator →
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-white text-[#1e3a8a] font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                            Nodal Officer Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-12 mb-16">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-2xl mb-4">🤖</div>
                    <h3 className="text-xl font-bold text-[#0f172a] mb-2">AI Challenge Drafter</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Transforms vague departmental problems into structured, outcome-based RFPs instantly using Gemini AI.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-2xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold text-[#0f172a] mb-2">Smart Escrow Vault</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Guarantees startup cash flow. Funds are locked securely and released automatically via cryptographic milestone verification.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center text-2xl mb-4">🏛️</div>
                    <h3 className="text-xl font-bold text-[#0f172a] mb-2">1-Click GeM Scale-Up</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Generates fully compliant GFR validation reports and JSON packages for seamless integration into state-wide procurement.</p>
                </div>
            </div>
        </div>
    );
}