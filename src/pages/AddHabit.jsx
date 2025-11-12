import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import axiosSecure from '../utils/axiosSecure'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || ''

export default function AddHabit() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    reminderTime: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    { name: 'Health & Fitness', icon: '💪', color: 'from-green-500 to-emerald-500' },
    { name: 'Productivity', icon: '⚡', color: 'from-blue-500 to-cyan-500' },
    { name: 'Mindfulness', icon: '🧘', color: 'from-purple-500 to-pink-500' },
    { name: 'Learning', icon: '📚', color: 'from-yellow-500 to-orange-500' },
    { name: 'Social', icon: '🤝', color: 'from-indigo-500 to-purple-500' },
    { name: 'Other', icon: '✨', color: 'from-gray-500 to-gray-600' }
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const uploadImageToImgBB = async (file) => {
    if (!IMGBB_API_KEY) {
      console.warn('ImgBB API key not set, skipping image upload')
      return null
    }
    
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      )
      return response.data.data.url
    } catch (error) {
      console.error('Image upload failed:', error)
      toast.error('Failed to upload image')
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      let imageUrl = null
      
      // Upload image to ImgBB if provided
      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadImageToImgBB(imageFile)
        setUploading(false)
      }

      // Prepare habit data
      const habitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        reminderTime: formData.reminderTime,
        imageUrl: imageUrl,
        userEmail: user.email,
        userName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
      }

      // Send POST request to server
      const response = await axiosSecure.post('/habits', habitData)
      
      if (response.data) {
        toast.success('Habit created successfully!')
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          reminderTime: '',
        })
        setImageFile(null)
        // Reset file input
        const fileInput = document.getElementById('imageInput')
        if (fileInput) fileInput.value = ''
      }
    } catch (error) {
      console.error('Error creating habit:', error)
      toast.error('Failed to create habit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-block p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
            Create New Habit
          </h2>
          <p className="text-gray-600 text-lg">
            Start your journey to a better you ✨
          </p>
        </motion.div>
      
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 space-y-6"
        >
        {/* Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Habit Title *
            </span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Morning Exercise, Read 30 Minutes, Drink Water"
            className="input input-bordered w-full h-14 text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all rounded-xl"
            required
          />
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="text-2xl">📝</span> Description *
            </span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your habit and why it's important to you..."
            className="textarea textarea-bordered w-full h-32 text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all rounded-xl resize-none"
            required
          />
        </div>

        {/* Category */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="text-2xl">📂</span> Category *
            </span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.name}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, category: cat.name })}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  formData.category === cat.name
                    ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-lg`
                    : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="text-3xl mb-1">{cat.icon}</div>
                <div className={`text-sm font-semibold ${
                  formData.category === cat.name ? 'text-white' : 'text-gray-700'
                }`}>
                  {cat.name}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Reminder Time */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="text-2xl">⏰</span> Reminder Time (Optional)
            </span>
          </label>
          <div className="relative">
            <input
              type="time"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
              className="input input-bordered w-full h-14 text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all rounded-xl"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="text-2xl">🖼️</span> Add Image (Optional)
            </span>
          </label>
          <div className="relative">
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full h-14 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all rounded-xl"
            />
            {imageFile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-700">Selected: {imageFile.name}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border-2 border-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-500">Created by</div>
              <div className="text-lg font-bold text-gray-800">{user?.displayName || user?.email || 'User'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{user?.email}</span>
          </div>
        </div>

        {/* Submit Button */}
        <motion.div 
          className="form-control pt-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            type="submit"
            className="btn w-full h-16 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting || uploading}
          >
            {uploading ? (
              <>
                <span className="loading loading-spinner"></span>
                Uploading Image...
              </>
            ) : submitting ? (
              <>
                <span className="loading loading-spinner"></span>
                Creating Habit...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create My Habit
              </>
            )}
          </button>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl"
        >
          <p className="text-sm font-medium text-gray-700">
            💡 <span className="font-bold">Pro Tip:</span> Start small and be consistent. Every habit begins with a single step!
          </p>
        </motion.div>
        </motion.form>
      </div>
    </div>
  )
}
