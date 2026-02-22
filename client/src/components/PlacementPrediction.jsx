import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, BrainCircuit, Activity, CheckCircle2, AlertTriangle, AlertCircle, Award, Target, Trophy } from 'lucide-react';

const PlacementPrediction = () => {
    const [formData, setFormData] = useState({
        DSA_Skill: '',
        GP: '',
        Internships: '',
        Active_Backlogs: '',
        Tenth_Marks: '',
        Twelfth_Marks: ''
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Ensure values are numbers
            const payload = {
                DSA_Skill: parseFloat(formData.DSA_Skill),
                GP: parseFloat(formData.GP),
                Internships: parseInt(formData.Internships, 10),
                Active_Backlogs: parseInt(formData.Active_Backlogs, 10),
                Tenth_Marks: parseFloat(formData.Tenth_Marks),
                Twelfth_Marks: parseFloat(formData.Twelfth_Marks)
            };

            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/placement/predict`, payload);
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch prediction.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generateInsights = () => {
        const insights = [];
        const { DSA_Skill, GP, Internships, Active_Backlogs } = formData;

        if (parseFloat(Active_Backlogs) > 0) {
            insights.push({ type: 'danger', title: 'Critical', text: 'Active backlogs significantly reduce placement chances. Prioritize clearing them immediately.' });
        }
        if (parseFloat(GP) < 7.0) {
            insights.push({ type: 'warning', title: 'Academic', text: 'A CGPA below 7.0 might filter you out from many initial resume screenings. Try to pull it up.' });
        } else if (parseFloat(GP) >= 8.5) {
            insights.push({ type: 'success', title: 'Academic', text: 'Great CGPA! This gives you a strong academic advantage.' });
        }

        if (parseFloat(DSA_Skill) < 6.0) {
            insights.push({ type: 'warning', title: 'Technical', text: 'Consider improving your Data Structures & Algorithms (DSA) skills through platforms like LeetCode.' });
        } else if (parseFloat(DSA_Skill) >= 8.0) {
            insights.push({ type: 'success', title: 'Technical', text: 'Strong DSA skills significantly boost your chances for technical roles.' });
        }

        if (parseInt(Internships, 10) === 0) {
            insights.push({ type: 'warning', title: 'Experience', text: 'Securing at least one internship can provide crucial practical experience to stand out.' });
        } else if (parseInt(Internships, 10) >= 2) {
            insights.push({ type: 'success', title: 'Experience', text: 'Multiple internships show great industry exposure and practical readiness.' });
        }

        return insights;
    };

    return (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden relative">
            {/* Header Area */}
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6 sm:p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-10 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
                <div className="relative flex items-center space-x-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-inner">
                        <BrainCircuit className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                            AI Placement Predictor
                        </h2>
                        <p className="text-indigo-100 text-sm mt-1 max-w-lg">
                            Leverage our Neural Network engine to evaluate your academic and skill metrics against historical industry placement data.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current CGPA (0-10)</label>
                                <input
                                    type="number" step="0.01" min="0" max="10" required name="GP"
                                    value={formData.GP} onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">10th Marks (%)</label>
                            <input
                                type="number" step="0.1" min="0" max="100" required name="Tenth_Marks"
                                value={formData.Tenth_Marks} onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">12th Marks (%)</label>
                            <input
                                type="number" step="0.1" min="0" max="100" required name="Twelfth_Marks"
                                value={formData.Twelfth_Marks} onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">DSA Skill Score (0-10)</label>
                            <input
                                type="number" step="0.1" min="0" max="10" required name="DSA_Skill"
                                value={formData.DSA_Skill} onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                                Evaluate yourself: 0-3 (Beginner), 4-6 (Intermediate / ~100 LeetCode), 7-10 (Advanced / ~300+ LeetCode)
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Internships</label>
                            <input
                                type="number" min="0" required name="Internships"
                                value={formData.Internships} onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Active Backlogs</label>
                            <input
                                type="number" min="0" required name="Active_Backlogs"
                                value={formData.Active_Backlogs} onChange={handleChange}
                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-white/20 hover:bg-white/0 transition duration-300 ease-out" />
                            <span className="relative flex items-center justify-center">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing Profile...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                        Generate Prediction
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 fade-in-0 transform">
                        <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 shadow-xl ${result.prediction === 'Placed'
                            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800/50'
                            : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800/50'
                            }`}>
                            {/* Decorative Background Icon */}
                            <div className="absolute -right-4 -bottom-4 opacity-[0.05] dark:opacity-10 pointer-events-none">
                                {result.prediction === 'Placed' ? (
                                    <Trophy className="w-48 h-48 text-emerald-900 dark:text-emerald-100" />
                                ) : (
                                    <Target className="w-48 h-48 text-amber-900 dark:text-amber-100" />
                                )}
                            </div>

                            <div className="p-6 sm:p-8 relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-4 rounded-full shadow-inner ${result.prediction === 'Placed'
                                            ? 'bg-emerald-100/80 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-300'
                                            : 'bg-amber-100/80 dark:bg-amber-800/50 text-amber-600 dark:text-amber-300'
                                            }`}>
                                            {result.prediction === 'Placed' ? <Award className="h-8 w-8" /> : <Target className="h-8 w-8" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Prediction</p>
                                            <p className={`text-3xl font-extrabold mt-1 tracking-tight ${result.prediction === 'Placed' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-500'
                                                }`}>
                                                {result.prediction}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="sm:text-right flex items-center gap-4 sm:gap-2 sm:flex-col sm:items-end bg-white/50 dark:bg-slate-900/30 p-4 rounded-2xl shadow-sm border border-white/40 dark:border-slate-700/50 backdrop-blur-sm">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-full">Probability Score</p>
                                        <div className="flex items-baseline justify-end gap-1">
                                            <p className="text-4xl font-black text-slate-900 dark:text-white">
                                                {(result.probability * 100).toFixed(1)}
                                            </p>
                                            <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50">
                                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center tracking-tight">
                                    <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                                    Personalized Profile Analysis
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {generateInsights().map((insight, index) => {
                                        const Icon = insight.type === 'danger' ? AlertCircle :
                                            insight.type === 'warning' ? AlertTriangle : CheckCircle2;

                                        return (
                                            <div key={index} className={`flex items-start gap-4 p-4 rounded-2xl border transition-transform hover:-translate-y-1 duration-300 shadow-sm ${insight.type === 'danger' ? 'bg-red-50/80 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-300' :
                                                insight.type === 'warning' ? 'bg-amber-50/80 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-300' :
                                                    'bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-300'
                                                }`}>
                                                <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${insight.type === 'danger' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' :
                                                    insight.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' :
                                                        'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${insight.type === 'danger' ? 'text-red-700 dark:text-red-400' :
                                                        insight.type === 'warning' ? 'text-amber-700 dark:text-amber-500' :
                                                            'text-emerald-700 dark:text-emerald-400'
                                                        }`}>{insight.title} Factor</p>
                                                    <p className="text-sm font-medium leading-relaxed opacity-90">{insight.text}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlacementPrediction;
