import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { 
  Search, 
  X, 
  RotateCcw, 
  Sparkles, 
  Dumbbell, 
  Zap, 
  Brain, 
  BookOpen, 
  Users, 
  Star,
  Flame,
  ArrowRight,
  Globe
} from 'lucide-react'

export default function BrowsePublicHabits() {
  const navigate = useNavigate()
  const [habits, setHabits] = useState([])
  const [filteredHabits, setFilteredHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = [
    { name: 'All', icon: Sparkles, gradient: 'from-purple-500 to-pink-500' },
    { name: 'Health & Fitness', icon: Dumbbell, gradient: 'from-green-500 to-emerald-500' },
    { name: 'Productivity', icon: Zap, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Mindfulness', icon: Brain, gradient: 'from-purple-500 to-indigo-500' },
    { name: 'Learning', icon: BookOpen, gradient: 'from-orange-500 to-amber-500' },
    { name: 'Social', icon: Users, gradient: 'from-pink-500 to-rose-500' },
    { name: 'Other', icon: Star, gradient: 'from-gray-500 to-slate-500' }
  ]

  useEffect(() => {
    fetchPublicHabits()
  }, [])

  useEffect(() => {
    filterHabits()
  }, [searchTerm, selectedCategory, habits])

  const fetchPublicHabits = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await axios.get(`${apiUrl}/habits/public`)
      setHabits(response.data)
      setFilteredHabits(response.data)
    } catch (error) {
      console.error('Error fetching public habits:', error)
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please check your backend URL.')
      } else {
        toast.error('Failed to load habits. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const filterHabits = () => {
    let filtered = [...habits]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(habit =>
        habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        habit.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(habit => habit.category === selectedCategory)
    }

    setFilteredHabits(filtered)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName)
  }

  const viewDetails = (habitId) => {
    navigate(`/habit/${habitId}`)
  }

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName)
    return category ? category.icon : Star
  }

  const getCategoryGradient = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName)
    return category ? category.gradient : 'from-gray-500 to-slate-500'
  }

  const renderCategoryIcon = (categoryName, className = "w-4 h-4") => {
    const IconComponent = getCategoryIcon(categoryName)
    return <IconComponent className={className} />
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
            >
              Loading amazing habits...
            </motion.p>
            <p className="mt-2 text-gray-500">Discover inspiring journeys ✨</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-200 rounded-full text-sm font-bold mb-6 shadow-md">
            <Globe className="w-5 h-5 text-orange-600" />
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Community Habits
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Explore Habits
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover thousands of habits from our amazing community. Find inspiration and start your journey today!
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-2">
              <div className="flex items-center gap-3 px-4">
                <Search className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search habits by title or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-1 py-4 text-lg outline-none bg-transparent"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-xl
                    ${selectedCategory === category.name 
                      ? `bg-gradient-to-r ${category.gradient} text-white scale-110` 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  {category.name}
                  {selectedCategory === category.name && (
                    <span className="ml-1 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                      {filteredHabits.length}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-8 px-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {filteredHabits.length}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {filteredHabits.length === habits.length 
                  ? 'All Habits' 
                  : `Filtered Results`
                }
              </p>
              <p className="text-sm text-gray-500">
                Showing {filteredHabits.length} of {habits.length} habits
              </p>
            </div>
          </div>
          
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <RotateCcw className="w-5 h-5" />
              Clear Filters
            </button>
          )}
        </motion.div>

        {/* Habits Grid */}
        {filteredHabits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-xl mx-auto max-w-2xl"
          >
            <div className="flex justify-center mb-6">
              <Search className="w-32 h-32 text-gray-300 animate-bounce" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">No habits found</h3>
            <p className="text-lg text-gray-600 mb-8">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              View All Habits
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHabits.map((habit, index) => (
              <motion.article
                key={habit._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-gray-100 hover:border-orange-200 overflow-hidden"
              >
                {/* Gradient Top Bar */}
                <div className={`h-2 w-full bg-gradient-to-r ${getCategoryGradient(habit.category)}`}></div>

                {/* Beautiful Image or Gradient Background */}
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
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 group-hover:scale-110 transition-transform duration-500">
                        {renderCategoryIcon(habit.category, "w-20 h-20 text-white drop-shadow-lg")}
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
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r ${getCategoryGradient(habit.category)} text-white text-xs font-bold rounded-full shadow-md`}>
                      {renderCategoryIcon(habit.category, "w-3.5 h-3.5")}
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
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {habit.description}
                  </p>

                  {/* Author & Stats */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className={`bg-gradient-to-br ${getCategoryGradient(habit.category)} text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md`}>
                          <span className="text-sm font-bold">
                            {(habit.userName || habit.authorName || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created by</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {habit.userName || habit.authorName || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-xs font-semibold text-gray-700">
                        {formatDate(habit.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => viewDetails(habit._id)}
                    className="w-full btn h-14 text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl group flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
