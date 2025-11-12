import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase/firebase.init'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { User, Camera, Save, Mail, Shield, Upload, X } from 'lucide-react'

export default function ProfileSettings() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(user?.photoURL || '')
  const [photoOption, setPhotoOption] = useState('url') // 'url' or 'upload'
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      setPhotoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(user?.photoURL || '')
  }

  const handlePhotoURLChange = (e) => {
    const url = e.target.value
    setPhotoURL(url)
    if (url) {
      setPhotoPreview(url)
    } else {
      setPhotoPreview(user?.photoURL || '')
    }
  }

  const uploadPhoto = async () => {
    if (!photoFile) return user?.photoURL

    try {
      const storage = getStorage()
      const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}_${photoFile.name}`)
      
      setUploadProgress(10)
      await uploadBytes(storageRef, photoFile)
      setUploadProgress(80)
      
      const photoURL = await getDownloadURL(storageRef)
      setUploadProgress(100)
      
      return photoURL
    } catch (error) {
      console.error('Photo upload error:', error)
      throw new Error('Failed to upload photo')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!displayName.trim()) {
      toast.error('Please enter your name')
      return
    }

    setLoading(true)
    
    try {
      let finalPhotoURL = user?.photoURL

      // Handle photo based on selected option
      if (photoOption === 'upload' && photoFile) {
        // Upload new photo file
        finalPhotoURL = await uploadPhoto()
      } else if (photoOption === 'url' && photoURL) {
        // Use provided photo URL
        finalPhotoURL = photoURL
      }

      // Update Firebase profile
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        photoURL: finalPhotoURL
      })

      toast.success('Profile updated successfully! 🎉')
      setPhotoFile(null)
      setUploadProgress(0)
      
      // Reload to update navbar
      window.location.reload()
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-200 rounded-full text-sm font-bold mb-6 shadow-md">
            <User className="w-5 h-5 text-orange-600" />
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Profile Settings
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Manage Your Profile
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Update your profile information and photo
          </p>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photo Upload Section */}
            <div className="text-center">
              <label className="block text-lg font-bold text-gray-800 mb-6">
                <Camera className="inline w-5 h-5 mr-2" />
                Profile Photo
              </label>
              
              <div className="flex flex-col items-center gap-6">
                {/* Photo Preview */}
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-orange-200 shadow-xl">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-5xl ${photoPreview ? 'hidden' : ''}`}>
                      {(displayName || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Remove Photo Button */}
                  {(photoFile || (photoOption === 'url' && photoURL && photoURL !== user?.photoURL)) && (
                    <button
                      type="button"
                      onClick={() => {
                        handleRemovePhoto()
                        setPhotoURL(user?.photoURL || '')
                        setPhotoPreview(user?.photoURL || '')
                      }}
                      className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Photo Option Toggle */}
                <div className="flex gap-3 w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => setPhotoOption('url')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      photoOption === 'url'
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
                    onClick={() => setPhotoOption('upload')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      photoOption === 'upload'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Photo
                    </div>
                  </button>
                </div>

                {/* Image URL Input */}
                {photoOption === 'url' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                  >
                    <div className="relative">
                      <input
                        type="url"
                        value={photoURL}
                        onChange={handlePhotoURLChange}
                        placeholder="https://example.com/your-photo.jpg"
                        className="w-full px-6 py-4 text-base border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 pl-12"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                    </div>
                    {photoURL && photoURL !== user?.photoURL && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl"
                      >
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-700 mb-1">New Image URL:</p>
                            <p className="text-xs text-blue-600 break-all">{photoURL}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* File Upload Input */}
                {photoOption === 'upload' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md"
                  >
                    <div className="flex flex-col gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                          <Upload className="w-5 h-5" />
                          Choose Photo
                        </div>
                      </label>
                      
                      {photoFile && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2"
                        >
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium text-green-700">Selected: {photoFile.name}</span>
                        </motion.div>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                      JPG, PNG or GIF (Max 5MB)
                    </p>

                    {/* Upload Progress */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full mt-3">
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8"></div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-lg font-bold text-gray-800 mb-3">
                <User className="inline w-5 h-5 mr-2" />
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                <Mail className="inline w-5 h-5 mr-2" />
                Email Address
              </label>
              <div className="flex items-center gap-3 px-6 py-4 text-lg bg-gray-100 border-2 border-gray-200 rounded-xl">
                <span className="text-gray-700">{user?.email}</span>
                <span className="ml-auto flex items-center gap-1 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  Verified
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Email cannot be changed
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-5 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-200 rounded-lg">
                <Camera className="w-5 h-5 text-orange-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">Profile Photo Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use a clear, front-facing photo</li>
                  <li>• Square photos work best (1:1 ratio)</li>
                  <li>• Maximum file size: 5MB</li>
                  <li>• Supported formats: JPG, PNG, GIF</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
