import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import StudentDetailsModal from '../components/StudentDetailsModal'
import AnnouncementFeed from '../components/AnnouncementFeed'
import api from '../services/api'
import { Users, MessageSquare, Calendar, TrendingUp, Phone, Mail, User, Eye, FileText, Megaphone, RefreshCcw, Shield } from 'lucide-react'
import AdminDashboard from './AdminDashboard'
import PlacementPrediction from '../components/PlacementPrediction'

const DashboardPage = () => {
    const { user, profile } = useAuth()
    const navigate = useNavigate()
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [showStudentModal, setShowStudentModal] = useState(false)
    const [showExpandedMentees, setShowExpandedMentees] = useState(false)
    const [announcementRefreshKey, setAnnouncementRefreshKey] = useState(0)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            let endpoint = null

            if (user.role === 'mentor') {
                endpoint = '/mentors/dashboard'
            } else if (user.role === 'mentee') {
                endpoint = '/mentees/dashboard'
            } else if (user.role === 'guardian') {
                endpoint = '/guardians/dashboard'
            }

            if (endpoint) {
                const response = await api.get(endpoint)
                setDashboardData(response.data)
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAnnouncementRefresh = () => {
        setAnnouncementRefreshKey(prev => prev + 1)
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <LoadingSpinner />
                </div>
            </Layout>
        )
    }

    const MentorDashboard = () => (
        <div className="space-y-6">
            {/* Primary Stats - Key Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    onClick={() => setShowExpandedMentees(true)}
                    className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-blue-200/50 dark:border-blue-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                                Active
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">My Mentees</p>
                            <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                {dashboardData?.stats?.totalMentees || 0}
                            </p>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                <TrendingUp className="h-3 w-3 mr-1 text-blue-500" />
                                <span>Active students</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/groups')}
                    className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-emerald-200/50 dark:border-emerald-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <MessageSquare className="h-6 w-6 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                                Active
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Active Groups</p>
                            <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                {dashboardData?.stats?.totalGroups || 0}
                            </p>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                <Users className="h-3 w-3 mr-1 text-emerald-500" />
                                <span>Discussion groups</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/leaves')}
                    className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-amber-200/50 dark:border-amber-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full">
                                Pending
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Leave Requests</p>
                            <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                {dashboardData?.stats?.pendingLeaves || 0}
                            </p>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                <Calendar className="h-3 w-3 mr-1 text-amber-500" />
                                <span>Awaiting approval</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/grievances')}
                    className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-rose-200/50 dark:border-rose-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-pink-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-full">
                                Active
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Grievances</p>
                            <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                {dashboardData?.stats?.totalGrievances || 0}
                            </p>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                <FileText className="h-3 w-3 mr-1 text-rose-500" />
                                <span>To review</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Leaves */}
                <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <Calendar className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Recent Leaves</h3>
                                    <p className="text-amber-100 text-xs">Latest requests</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                <span className="text-white text-sm font-semibold">{dashboardData?.recentLeaves?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="space-y-3">
                            {dashboardData?.recentLeaves?.length > 0 ? (
                                dashboardData.recentLeaves.map((leave, index) => (
                                    <div
                                        key={leave._id}
                                        className="group/item flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700/30 dark:to-slate-700/20 hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 border border-slate-200/50 dark:border-slate-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg transition-transform group-hover/item:scale-110">
                                                <Calendar className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                                                {leave.menteeId?.fullName || 'Unknown Student'}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 capitalize">
                                                {leave.leaveType} • {leave.daysCount} {leave.daysCount === 1 ? 'Day' : 'Days'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' :
                                                    leave.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                    }`}>
                                                    {leave.status}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {new Date(leave.createdAt || leave.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 mb-3">
                                        <Calendar className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No recent leaves</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Messages */}
                <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <MessageSquare className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Recent Messages</h3>
                                    <p className="text-cyan-100 text-xs">Latest conversations</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                <span className="text-white text-sm font-semibold">{dashboardData?.stats?.totalGroups || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="space-y-3">
                            {dashboardData?.mentees?.length > 0 ? (
                                dashboardData.mentees.slice(0, 5).map((mentee, index) => (
                                    <div
                                        key={mentee._id}
                                        onClick={() => navigate(`/chat/individual_${mentee._id}`)}
                                        className="group/item flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700/30 dark:to-slate-700/20 hover:from-cyan-50 hover:to-blue-50 dark:hover:from-cyan-900/20 dark:hover:to-blue-900/20 border border-slate-200/50 dark:border-slate-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg transition-transform group-hover/item:scale-110 text-white font-bold text-sm">
                                                {mentee.fullName?.charAt(0) || '?'}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                                                {mentee.fullName}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                                Class {mentee.class}-{mentee.section} • ID: {mentee.studentId}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                                                    Active
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 mb-3">
                                        <MessageSquare className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No recent messages</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Grievances */}
                <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="relative bg-gradient-to-r from-rose-500 to-pink-600 p-5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Recent Grievances</h3>
                                    <p className="text-rose-100 text-xs">Latest submissions</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                <span className="text-white text-sm font-semibold">{dashboardData?.stats?.totalGrievances || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="space-y-3">
                            {dashboardData?.recentGrievances?.length > 0 || dashboardData?.stats?.totalGrievances > 0 ? (
                                <div
                                    onClick={() => navigate('/grievances')}
                                    className="group/item flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700/30 dark:to-slate-700/20 hover:from-rose-50 hover:to-pink-50 dark:hover:from-rose-900/20 dark:hover:to-pink-900/20 border border-slate-200/50 dark:border-slate-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg transition-transform group-hover/item:scale-110">
                                            <FileText className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                            View All Grievances
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                            {dashboardData?.stats?.totalGrievances || 0} active {dashboardData?.stats?.totalGrievances === 1 ? 'grievance' : 'grievances'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                                                Pending Review
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 mb-3">
                                        <FileText className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No recent grievances</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const ExpandedMenteesView = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 w-full max-w-7xl max-h-[95vh] overflow-hidden animate-scaleIn">
                {/* Header */}
                <div className="p-6 border-b border-white/20 dark:border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                                    My Mentees
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Manage and monitor your {dashboardData?.mentees?.length || 0} students
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowExpandedMentees(false)}
                            className="p-3 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors duration-200 group"
                        >
                            <svg className="h-6 w-6 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
                    {dashboardData?.mentees?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {dashboardData.mentees.map((mentee, index) => (
                                <div
                                    key={mentee._id}
                                    className="bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-600/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] message-bubble"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Student Header */}
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            {mentee.fullName?.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                                {mentee.fullName}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                ID: {mentee.studentId}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Class {mentee.class}-{mentee.section}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-white/50 dark:bg-slate-600/50 rounded-xl p-3">
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                <div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">Attendance</p>
                                                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                                                        {mentee.attendance?.percentage || 0}%
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/50 dark:bg-slate-600/50 rounded-xl p-3">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                <div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">Present Days</p>
                                                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                                                        {mentee.attendance?.presentDays || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                                            <Mail className="h-4 w-4" />
                                            <span className="truncate">{mentee.userId?.email}</span>
                                        </div>
                                        {mentee.phone && (
                                            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                                                <Phone className="h-4 w-4" />
                                                <span>{mentee.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                                            <User className="h-4 w-4" />
                                            <span>
                                                Last login: {mentee.userId?.lastLogin
                                                    ? new Date(mentee.userId.lastLogin).toLocaleDateString()
                                                    : 'Never'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Attendance Progress */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                                            <span>Attendance Progress</span>
                                            <span>{mentee.attendance?.presentDays || 0}/{mentee.attendance?.totalDays || 0}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-1000 ${(mentee.attendance?.percentage || 0) >= 90
                                                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                                                    : (mentee.attendance?.percentage || 0) >= 75
                                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                                                        : 'bg-gradient-to-r from-red-500 to-red-400'
                                                    }`}
                                                style={{
                                                    width: `${mentee.attendance?.percentage || 0}%`,
                                                    animationDelay: `${index * 0.2}s`
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => {
                                                setSelectedStudent(mentee)
                                                setShowStudentModal(true)
                                            }}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => window.location.href = `/chat/individual_${mentee._id}`}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="h-24 w-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                <Users className="h-12 w-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                                No Mentees Yet
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                You haven't been assigned any mentees yet. Contact your administrator to get started with mentoring.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    const MenteeDashboard = () => (
        <div className="space-y-6">
            {/* Primary Stats - Key Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Attendance Card */}
                <div
                    onClick={() => navigate('/profile')}
                    className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-emerald-200/50 dark:border-emerald-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                                {dashboardData?.stats?.attendancePercentage >= 75 ? 'Good' : 'Low'}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Attendance</p>
                            <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                {dashboardData?.stats?.attendancePercentage || 0}%
                            </p>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                <Calendar className="h-3 w-3 mr-1 text-emerald-500" />
                                <span>This semester</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grievances Card */}
                <div
                    onClick={() => navigate('/grievances')}
                    className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-rose-200/50 dark:border-rose-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-pink-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-full">
                                Active
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Grievances</p>
                            <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                {dashboardData?.stats?.totalGrievances || 0}
                            </p>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                <FileText className="h-3 w-3 mr-1 text-rose-500" />
                                <span>Submitted</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaves Status Card */}
                <div
                    onClick={() => navigate('/leaves')}
                    className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-amber-200/50 dark:border-amber-500/30"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full">
                                {dashboardData?.stats?.pendingLeaves || 0} Pending
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Leave Requests</p>
                            <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                {dashboardData?.stats?.approvedLeaves || 0}
                            </p>
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                <Calendar className="h-3 w-3 mr-1 text-amber-500" />
                                <span>Approved leaves</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Leave Requests */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Recent Leaves</h3>
                                <p className="text-amber-100 text-xs">Latest requests</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                            <span className="text-white text-sm font-semibold">{dashboardData?.recentLeaves?.length || 0}</span>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <div className="space-y-3">
                        {dashboardData?.recentLeaves?.length > 0 ? (
                            dashboardData.recentLeaves.map((leave, index) => (
                                <div
                                    key={leave._id}
                                    className="group/item flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700/30 dark:to-slate-700/20 hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 border border-slate-200/50 dark:border-slate-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg transition-transform group-hover/item:scale-110">
                                            <Calendar className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white capitalize">
                                            {leave.leaveType} Leave
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                            {new Date(leave.startDate).toLocaleDateString()} • {leave.daysCount} {leave.daysCount === 1 ? 'Day' : 'Days'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' :
                                                leave.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                }`}>
                                                {leave.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 mb-3">
                                    <Calendar className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No recent leaves</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Placement Prediction Section */}
            <PlacementPrediction />

            {/* Announcements Section */}
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 dark:border-slate-700/50">
                <div className="px-6 py-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                                <Megaphone className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                                Announcements
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Stay on top of updates from your mentors and administrators.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAnnouncementRefresh}
                            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100/60 dark:bg-slate-700/60 hover:bg-slate-200/60 dark:hover:bg-slate-600/60 transition-all duration-200 text-sm font-medium text-slate-600 dark:text-slate-300"
                        >
                            <RefreshCcw className="h-4 w-4" />
                            <span>Refresh Feed</span>
                        </button>
                    </div>

                    <AnnouncementFeed key={announcementRefreshKey} showHeader={false} />
                </div>
            </div>
        </div>
    )

    const GuardianDashboard = () => {
        const guardianMentees = profile?.menteeIds || []
        const stats = dashboardData?.stats || {}
        const recentGrievances = dashboardData?.recentGrievances || []

        return (
            <div className="space-y-6">
                {/* Primary Stats - Key Metrics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Linked Students Card */}
                    <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-emerald-200/50 dark:border-emerald-500/30">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full">
                                    Active
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Linked Students</p>
                                <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                    {guardianMentees.length}
                                </p>
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                    <Users className="h-3 w-3 mr-1 text-emerald-500" />
                                    <span>Active connections</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Open Complaints Card */}
                    <div
                        onClick={() => navigate('/grievances')}
                        className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-amber-200/50 dark:border-amber-500/30"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-full">
                                    Pending
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Open Complaints</p>
                                <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                    {stats.pendingGrievances || 0}
                                </p>
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                    <FileText className="h-3 w-3 mr-1 text-amber-500" />
                                    <span>Awaiting resolution</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resolved Complaints Card */}
                    <div className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200/50 dark:border-blue-500/30">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                                    Resolved
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Resolved Complaints</p>
                                <p className="text-slate-900 dark:text-white text-4xl font-bold mb-2">
                                    {stats.resolvedGrievances || 0}
                                </p>
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                    <Shield className="h-3 w-3 mr-1 text-blue-500" />
                                    <span>Successfully addressed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Your Students Section */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Your Students</h3>
                                    <p className="text-emerald-100 text-xs">Linked accounts</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                <span className="text-white text-sm font-semibold">{guardianMentees.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="space-y-3">
                            {guardianMentees.length > 0 ? guardianMentees.map((mentee, index) => (
                                <div
                                    key={mentee._id || index}
                                    className="group/item flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700/30 dark:to-slate-700/20 hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 border border-slate-200/50 dark:border-slate-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover/item:scale-110">
                                            {mentee.fullName?.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                                            {mentee.fullName}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                            ID: {mentee.studentId} • Class {mentee.class}-{mentee.section}
                                        </p>
                                        {mentee.mentorId && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Mentor: {mentee.mentorId.fullName}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        {mentee.mentorId && (
                                            <button
                                                onClick={() => navigate(`/chat/individual_${mentee._id}`)}
                                                className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all duration-300 hover:scale-110"
                                                title="Chat with mentor"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => navigate('/grievances')}
                                            className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300 hover:scale-110"
                                            title="View grievances"
                                        >
                                            <FileText className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 mb-3">
                                        <Users className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No linked students</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Contact administrator for assistance</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Complaints Section */}
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Recent Complaints</h3>
                                    <p className="text-amber-100 text-xs">Latest submissions</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                <span className="text-white text-sm font-semibold">{recentGrievances.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="space-y-3">{recentGrievances.length > 0 ? (
                            recentGrievances.map((grievance, index) => (
                                <div
                                    key={grievance._id}
                                    className="group/item flex items-start space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-700/30 dark:to-slate-700/20 hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 border border-slate-200/50 dark:border-slate-600/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                                >
                                    <div className="flex-shrink-0">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover/item:scale-110 ${grievance.status === 'resolved' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                                            grievance.status === 'rejected' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                                                'bg-gradient-to-br from-amber-500 to-orange-600'
                                            }`}>
                                            <FileText className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                                            {grievance.subject}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                            {grievance.menteeId?.fullName} • {new Date(grievance.dateOfIncident).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${grievance.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' :
                                                grievance.status === 'in-review' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                                    grievance.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                                }`}>
                                                {grievance.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 mb-3">
                                    <FileText className="h-8 w-8 text-slate-400" />
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No recent complaints</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>

                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 dark:border-slate-700/50">
                    <div className="px-6 py-6 sm:p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                                <Megaphone className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                                Announcements
                            </h3>
                            <button
                                type="button"
                                onClick={handleAnnouncementRefresh}
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100/60 dark:bg-slate-700/60 hover:bg-slate-200/60 dark:hover:bg-slate-600/60 transition-all duration-200 text-sm font-medium text-slate-600 dark:text-slate-300"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                <span>Refresh Feed</span>
                            </button>
                        </div>

                        <AnnouncementFeed key={`guardian-${announcementRefreshKey}`} showHeader={false} />
                    </div>
                </div>
            </div>
        )
    }

    if (user.role === 'admin') {
        return <AdminDashboard />
    }

    return (
        <Layout>
            {user.role === 'mentor' ? (
                showExpandedMentees ? <ExpandedMenteesView /> : <MentorDashboard />
            ) : user.role === 'guardian' ? (
                <GuardianDashboard />
            ) : (
                <MenteeDashboard />
            )}

            {user.role === 'mentor' && (
                <StudentDetailsModal
                    student={selectedStudent}
                    isOpen={showStudentModal}
                    onClose={() => {
                        setShowStudentModal(false)
                        setSelectedStudent(null)
                    }}
                />
            )}
        </Layout>
    )
}

export default DashboardPage