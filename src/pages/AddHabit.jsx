import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import axiosSecure from '../utils/axiosSecure'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { IoMdFitness } from 'react-icons/io'
import { MdProductionQuantityLimits } from 'react-icons/md'
import { FaSpa, FaBook, FaUsers, FaStar, FaBullseye, FaFileAlt, FaFolderOpen, FaClock, FaImage } from 'react-icons/fa'

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || ''

export default function AddHabit() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    reminderTime: '',
    imageUrl: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imageOption, setImageOption] = useState('url') // 'url' or 'upload'
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    { name: 'Health & Fitness', icon: IoMdFitness, color: 'from-green-500 to-emerald-500' },
    { name: 'Productivity', icon: MdProductionQuantityLimits, color: 'from-blue-500 to-cyan-500' },
    { name: 'Mindfulness', icon: FaSpa, color: 'from-purple-500 to-pink-500' },
    { name: 'Learning', icon: FaBook, color: 'from-yellow-500 to-orange-500' },
    { name: 'Social', icon: FaUsers, color: 'from-indigo-500 to-purple-500' },
    { name: 'Other', icon: FaStar, color: 'from-gray-500 to-gray-600' }
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
      
      // Handle image based on selected option
      if (imageOption === 'upload' && imageFile) {
        // Upload image to ImgBB if file is provided
        setUploading(true)
        imageUrl = await uploadImageToImgBB(imageFile)
        setUploading(false)
      } else if (imageOption === 'url' && formData.imageUrl) {
        // Use provided image URL
        imageUrl = formData.imageUrl
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
          imageUrl: '',
        })
        setImageFile(null)
        setImageOption('url')
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
          <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
            Start your journey to a better you <FaStar className="text-yellow-500" />
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
              <FaBullseye className="text-2xl text-orange-600" /> Habit Title *
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
              <FaFileAlt className="text-2xl text-orange-600" /> Description *
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
              <FaFolderOpen className="text-2xl text-orange-600" /> Category *
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
                <cat.icon className="text-3xl mb-1" />
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
              <FaClock className="text-2xl text-orange-600" /> Reminder Time (Optional)
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

        {/* Image Section */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-bold text-gray-700 flex items-center gap-2">
              <FaImage className="text-2xl text-orange-600" /> Add Image (Optional)
            </span>
          </label>
          
          {/* Image Option Selector */}
          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => setImageOption('url')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                imageOption === 'url'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Image URL
              </div>
            </button>
            <button
              type="button"
              onClick={() => setImageOption('upload')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                imageOption === 'upload'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Photo
              </div>
            </button>
          </div>

          {/* Image URL Input */}
          {imageOption === 'url' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full h-14 text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all rounded-xl pl-12"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              {formData.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 space-y-3"
                >
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-700 mb-1">Image URL Preview:</p>
                        <p className="text-xs text-blue-600 break-all">{formData.imageUrl}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="absolute inset-0 hidden items-center justify-center bg-gray-100">
                      <div className="text-center p-4">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm text-gray-500">Unable to load image</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* File Upload Input */}
          {imageOption === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                  className="mt-3 space-y-3"
                >
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-green-700">Selected: {imageFile.name}</span>
                  </div>
                  <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border-2 border-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-300">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl ${user?.photoURL ? 'hidden' : ''}`}>
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
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
