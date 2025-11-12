import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axiosSecure from '../utils/axiosSecure'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Flame, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  TrendingUp, 
  User, 
  Mail, 
  FileText,
  Sparkles,
  Dumbbell,
  Zap,
  Brain,
  BookOpen,
  Target,
  Users,
  Star,
  Plus,
  Eye
} from 'lucide-react'

export default function HabitDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [habit, setHabit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)

  const getCategoryIcon = (category) => {
    const icons = {
      'Health': Dumbbell,
      'Productivity': Zap,
      'Mindfulness': Brain,
      'Learning': BookOpen,
      'Fitness': Target,
      'Social': Users,
      'Other': Sparkles
    }
    return icons[category] || Sparkles
  }

  const getCategoryGradient = (category) => {
    const gradients = {
      'Health': 'from-green-500 to-emerald-600',
      'Productivity': 'from-blue-500 to-indigo-600',
      'Mindfulness': 'from-purple-500 to-pink-600',
      'Learning': 'from-yellow-500 to-orange-600',
      'Fitness': 'from-red-500 to-pink-600',
      'Social': 'from-cyan-500 to-blue-600',
      'Other': 'from-gray-500 to-slate-600'
    }
    return gradients[category] || 'from-orange-500 to-red-500'
  }

  useEffect(() => {
    fetchHabitDetails()
  }, [id])

  const fetchHabitDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosSecure.get(`/habits/${id}`)
      setHabit(response.data)
    } catch (error) {
      console.error('Error fetching habit details:', error)
      toast.error('Failed to load habit details')
      navigate('/browse')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'Not set'
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split('T')[0] // Returns YYYY-MM-DD
  }

  const isCompletedToday = () => {
    if (!habit?.completionHistory || habit.completionHistory.length === 0) return false
    const today = getTodayString()
    return habit.completionHistory.some(date => {
      const completionDate = new Date(date).toISOString().split('T')[0]
      return completionDate === today
    })
  }

  const calculateProgress = () => {
    if (!habit?.completionHistory) return 0
    // Calculate progress for the last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
    
    const completionsInLast30Days = habit.completionHistory.filter(date => {
      const completionDate = new Date(date)
      return completionDate >= thirtyDaysAgo && completionDate <= today
    }).length
    
    const targetDays = 30
    return Math.min((completionsInLast30Days / targetDays) * 100, 100)
  }

  const handleMarkComplete = async () => {
    if (isCompletedToday()) {
      toast.error('You already completed this habit today!')
      return
    }

    try {
      setMarking(true)
      const today = new Date().toISOString()
      
      const response = await axiosSecure.put(`/habits/${id}/complete`, {
        completionDate: today
      })

      if (response.data) {
        setHabit(response.data)
        toast.success('Habit marked as complete! Keep up the great work! 🎉')
      }
    } catch (error) {
      console.error('Error marking habit complete:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to mark habit as complete')
      }
    } finally {
      setMarking(false)
    }
  }

  const isUserHabit = () => {
    return user && habit && user.email === habit.userEmail
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <LoadingSpinner message="Loading habit details..." />
      </div>
    )
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Habit Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            This habit doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/browse')} 
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-2xl shadow-lg hover:shadow-[0_20px_50px_rgba(249,115,22,0.4)] font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 mx-auto"
          >
            <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>Browse Habits</span>
          </button>
        </motion.div>
      </div>
    )
  }

  const CategoryIcon = getCategoryIcon(habit.category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-10">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 px-6 py-3 mb-6 bg-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 text-gray-700 hover:text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 font-semibold border-2 border-gray-200 hover:border-transparent"
        >
          <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        <div className="max-w-5xl mx-auto">
          {/* Hero Image */}
          {habit.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 relative overflow-hidden rounded-3xl shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
              <img
                src={habit.imageUrl}
                alt={habit.title}
                className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {habit.title}
                </h1>
              </div>
            </motion.div>
          )}

          {/* Main Content Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden mb-6"
          >
            {/* Gradient Header Bar */}
            <div className={`h-2 bg-gradient-to-r ${getCategoryGradient(habit.category)}`}></div>
            
            <div className="p-8">
              {/* Header Section */}
              <div className="flex flex-wrap justify-between items-start gap-6 mb-6">
                <div className="flex-1 min-w-[300px]">
                  {!habit.imageUrl && (
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {habit.title}
                    </h1>
                  )}
                  
                  <div className="flex gap-3 flex-wrap items-center">
                    {/* Category Badge */}
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getCategoryGradient(habit.category)} text-white font-semibold flex items-center gap-2 shadow-lg`}>
                      <CategoryIcon className="w-5 h-5" />
                      {habit.category}
                    </div>
                    
                    {/* Streak Badge */}
                    {habit.currentStreak > 0 && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold flex items-center gap-2 shadow-lg"
                      >
                        <Flame className="w-5 h-5 animate-pulse" />
                        {habit.currentStreak} Day Streak!
                      </motion.div>
                    )}
                    
                    {/* Completed Today Badge */}
                    {isCompletedToday() && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center gap-2 shadow-lg"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Completed Today
                      </motion.div>
                    )}
                  </div>
                </div>
                
                {/* Mark Complete Button - Only for user's own habits */}
                {isUserHabit() && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={handleMarkComplete}
                    disabled={marking || isCompletedToday()}
                    className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg text-white border-0 shadow-2xl transition-all duration-300 ${
                      isCompletedToday() 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 cursor-not-allowed opacity-80' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-[0_20px_50px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95'
                    }`}
                  >
                    {marking ? (
                      <>
                        <span className="loading loading-spinner loading-md"></span>
                        <span>Marking...</span>
                      </>
                    ) : isCompletedToday() ? (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
                        <span>Completed Today</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        <span>Mark Complete</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              {/* Progress Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="font-bold text-gray-800">30-Day Progress</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1 rounded-full">
                    {(() => {
                      const today = new Date()
                      const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
                      const count = habit.completionHistory?.filter(date => {
                        const completionDate = new Date(date)
                        return completionDate >= thirtyDaysAgo && completionDate <= today
                      }).length || 0
                      return `${count} / 30 days`
                    })()}
                  </span>
                </div>
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress()}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </motion.div>
                </div>
                <div className="text-sm font-semibold text-orange-600 mt-2">
                  {calculateProgress().toFixed(0)}% complete
                </div>
              </motion.div>

              {/* Habit Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Current Streak Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Flame className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-white/90">Current Streak</span>
                  </div>
                  <div className="text-5xl font-bold mb-1">{habit.currentStreak || 0}</div>
                  <div className="text-white/80 text-sm">days in a row</div>
                </motion.div>

                {/* Created Date Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-white/90">Created</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{formatDate(habit.createdAt)}</div>
                  <div className="text-white/80 text-sm">start date</div>
                </motion.div>

                {/* Reminder Time Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Clock className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-white/90">Reminder Time</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{formatTime(habit.reminderTime)}</div>
                  <div className="text-white/80 text-sm">daily notification</div>
                </motion.div>
              </div>

              {/* Description */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Description
                  </h2>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                    {habit.description}
                  </p>
                </div>
              </motion.div>

              {/* Completion History */}
              {habit.completionHistory && habit.completionHistory.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Completion History
                    </h3>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                    <div className="flex flex-wrap gap-3">
                      {habit.completionHistory.slice(-14).reverse().map((date, index) => {
                        const completionDate = new Date(date)
                        const dateStr = completionDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })
                        const isToday = getTodayString() === completionDate.toISOString().split('T')[0]
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.05 }}
                            className={`px-4 py-2 rounded-full font-semibold shadow-md flex items-center gap-2 ${
                              isToday 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                                : 'bg-white text-gray-700 border-2 border-green-200'
                            }`}
                          >
                            {isToday && <CheckCircle2 className="w-4 h-4" />}
                            {dateStr}
                          </motion.div>
                        )
                      })}
                    </div>
                    {habit.completionHistory.length > 14 && (
                      <p className="text-sm text-gray-600 mt-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        Showing last 14 completions • Total: {habit.completionHistory.length}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Creator Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Created By
                  </h3>
                </div>
                <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-md">
                  <div className="avatar placeholder">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold shadow-lg">
                      {habit.userName?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      {habit.userName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {habit.userEmail}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Additional Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            <button 
              onClick={() => navigate('/browse')} 
              className="group flex items-center gap-3 px-8 py-4 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 text-gray-700 hover:text-white border-2 border-gray-300 hover:border-transparent rounded-2xl shadow-lg hover:shadow-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Browse More Habits</span>
            </button>
            <button 
              onClick={() => navigate('/add-habit')} 
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-2xl shadow-lg hover:shadow-[0_20px_50px_rgba(249,115,22,0.4)] font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span>Create Your Own Habit</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
