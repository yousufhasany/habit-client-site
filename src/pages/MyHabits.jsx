import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axiosSecure from '../utils/axiosSecure'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Sparkles, 
  Dumbbell, 
  Zap, 
  Brain, 
  BookOpen, 
  Users, 
  Star,
  Flame,
  CheckCircle2,
  Edit3,
  Trash2,
  Calendar,
  TrendingUp,
  FileText,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react'

export default function MyHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [updateData, setUpdateData] = useState({
    title: '',
    description: '',
    category: '',
    reminderTime: '',
  })

  const categories = [
    'Health & Fitness',
    'Productivity',
    'Mindfulness',
    'Learning',
    'Social',
    'Other'
  ]

  const getCategoryIcon = (category) => {
    const icons = {
      'Health & Fitness': Dumbbell,
      'Productivity': Zap,
      'Mindfulness': Brain,
      'Learning': BookOpen,
      'Social': Users,
      'Other': Sparkles
    }
    return icons[category] || Sparkles
  }

  const getCategoryGradient = (category) => {
    const gradients = {
      'Health & Fitness': 'from-green-500 to-emerald-600',
      'Productivity': 'from-blue-500 to-indigo-600',
      'Mindfulness': 'from-purple-500 to-pink-600',
      'Learning': 'from-yellow-500 to-orange-600',
      'Social': 'from-cyan-500 to-blue-600',
      'Other': 'from-gray-500 to-slate-600'
    }
    return gradients[category] || 'from-orange-500 to-red-500'
  }

  useEffect(() => {
    fetchUserHabits()
  }, [user])

  const fetchUserHabits = async () => {
    try {
      setLoading(true)
      const response = await axiosSecure.get(`/habits?userEmail=${user.email}`)
      setHabits(response.data)
    } catch (error) {
      console.error('Error fetching habits:', error)
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check your backend URL.')
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.')
      } else {
        toast.error('Failed to load habits. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async (habitId) => {
    try {
      await axiosSecure.patch(`/habits/${habitId}/complete`)
      toast.success('Habit marked as complete!')
      fetchUserHabits() // Refresh the list
    } catch (error) {
      console.error('Error marking complete:', error)
      toast.error('Failed to mark habit as complete')
    }
  }

  const openUpdateModal = (habit) => {
    setSelectedHabit(habit)
    setUpdateData({
      title: habit.title,
      description: habit.description,
      category: habit.category,
      reminderTime: habit.reminderTime || '',
    })
    setShowUpdateModal(true)
  }

  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axiosSecure.put(`/habits/${selectedHabit._id}`, updateData)
      toast.success('Habit updated successfully!')
      setShowUpdateModal(false)
      fetchUserHabits()
    } catch (error) {
      console.error('Error updating habit:', error)
      toast.error('Failed to update habit')
    }
  }

  const openDeleteModal = (habit) => {
    setSelectedHabit(habit)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    try {
      await axiosSecure.delete(`/habits/${selectedHabit._id}`)
      toast.success('Habit deleted successfully!')
      setShowDeleteModal(false)
      fetchUserHabits()
    } catch (error) {
      console.error('Error deleting habit:', error)
      toast.error('Failed to delete habit')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <LoadingSpinner message="Loading your habits..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-10">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-between items-center gap-4 mb-10"
        >
          <div>
            <h2 className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              My Habits
            </h2>
            <p className="text-gray-600 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Track your progress and stay consistent
            </p>
          </div>
          <a 
            href="/add-habit" 
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-2xl shadow-lg hover:shadow-[0_20px_50px_rgba(249,115,22,0.4)] font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            Add New Habit
          </a>
        </motion.div>

        {habits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-xl max-w-2xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Start Your Journey</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              You haven't created any habits yet. Create your first habit and begin building better routines!
            </p>
            <a 
              href="/add-habit" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-2xl shadow-lg hover:shadow-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              Create Your First Habit
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {habits.map((habit, index) => {
              const CategoryIcon = getCategoryIcon(habit.category)
              return (
                <motion.article
                  key={habit._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-orange-200 overflow-hidden"
                >
                  {/* Gradient Top Bar */}
                  <div className={`h-2 w-full bg-gradient-to-r ${getCategoryGradient(habit.category)}`}></div>

                  {/* Beautiful Hero Image/Gradient */}
                  {habit.imageUrl ? (
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={habit.imageUrl}
                        alt={habit.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  ) : (
                    <div className={`h-48 bg-gradient-to-br ${getCategoryGradient(habit.category)} relative overflow-hidden`}>
                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full" 
                             style={{
                               backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.5) 0%, transparent 50%),
                                                 radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                                                 radial-gradient(circle at 40% 20%, rgba(255,255,255,0.4) 0%, transparent 50%)`
                             }}>
                        </div>
                      </div>
                      {/* Large Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                          <CategoryIcon className="w-24 h-24 text-white drop-shadow-2xl" />
                        </div>
                      </div>
                      {/* Corner Sparkles */}
                      <div className="absolute top-4 right-4">
                        <Sparkles className="w-6 h-6 text-white/60 animate-pulse" />
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Star className="w-5 h-5 text-white/50 fill-white/50" />
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category Badge & Streak */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${getCategoryGradient(habit.category)} text-white text-xs font-bold rounded-full shadow-md`}>
                        <CategoryIcon className="w-3.5 h-3.5" />
                        {habit.category}
                      </span>
                      {habit.currentStreak > 0 && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          {habit.currentStreak} days
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                      {habit.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {habit.description}
                    </p>

                    {/* Created Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                      <Calendar className="w-4 h-4" />
                      <span>Created {formatDate(habit.createdAt)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMarkComplete(habit._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        title="Mark Complete"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Complete
                      </button>
                      <button
                        onClick={() => openUpdateModal(habit)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        title="Update"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(habit)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="modal-box max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-0 overflow-hidden"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Update Habit</h3>
                    <p className="text-blue-100 text-sm">Make changes to your habit</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleUpdate} className="p-6">
              <div className="space-y-5">
                {/* Title Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={updateData.title}
                    onChange={handleUpdateChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-base font-medium"
                    placeholder="Enter habit title"
                    required
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={updateData.description}
                    onChange={handleUpdateChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-base resize-none"
                    placeholder="Describe your habit..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Category Select */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      Category
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={updateData.category}
                        onChange={handleUpdateChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-base font-medium appearance-none cursor-pointer"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Reminder Time Input */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      name="reminderTime"
                      value={updateData.reminderTime}
                      onChange={handleUpdateChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all text-base font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Update Habit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="modal-box max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-0 overflow-hidden"
          >
            {/* Header with Red Gradient */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Delete Habit</h3>
                    <p className="text-red-100 text-sm">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-base leading-relaxed mb-3">
                      Are you sure you want to delete this habit?
                    </p>
                    <div className="bg-white rounded-xl p-4 border border-red-200">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Habit Name:</p>
                      <p className="text-lg font-bold text-gray-900">{selectedHabit?.title}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-5 h-5" />
                  <p className="text-sm font-semibold">
                    This will permanently delete all progress and history for this habit.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Forever
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
