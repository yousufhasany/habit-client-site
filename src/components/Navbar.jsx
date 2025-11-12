import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase.init'
import ThemeToggle from './ThemeToggle'
import { Home, Compass, ListChecks, Plus, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      console.error('Sign out error', e)
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              H
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                HabitTracker
              </span>
              <p className="text-xs text-gray-500 -mt-1">Build Better Habits</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-gray-700 hover:text-orange-600 group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Home
            </Link>
            <Link 
              to="/browse" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-gray-700 hover:text-orange-600 group"
            >
              <Compass className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Browse
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {!user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="px-6 py-2.5 text-base font-semibold text-gray-700 hover:text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center gap-2 px-6 py-2.5 text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                {/* My Habits Button - Desktop */}
                <Link 
                  to="/my-habits" 
                  className="hidden lg:flex items-center gap-2 px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-300"
                >
                  <ListChecks className="w-5 h-5" />
                  My Habits
                </Link>

                {/* Add Habit Button - Desktop */}
                <Link 
                  to="/add-habit" 
                  className="hidden lg:flex items-center gap-2 px-6 py-2.5 text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Add Habit
                </Link>

                {/* User Profile Info - Desktop */}
                <Link 
                  to="/profile-settings"
                  className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-orange-300 group-hover:ring-orange-400 transition-all">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="user" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="font-bold text-gray-800 truncate text-sm group-hover:text-orange-600 transition-colors">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <User className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors ml-1" />
                </Link>

                {/* Sign Out Button - Desktop (After Profile) */}
                <button 
                  onClick={handleSignOut}
                  className="hidden lg:flex items-center gap-2 px-5 py-2.5 text-base font-semibold text-gray-700 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-orange-50 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-gray-100 mt-2">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-gray-700"
              >
                <Home className="w-5 h-5 text-orange-600" />
                Home
              </Link>
              <Link 
                to="/browse" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-gray-700"
              >
                <Compass className="w-5 h-5 text-orange-600" />
                Browse
              </Link>
              {user && (
                <>
                  <Link 
                    to="/my-habits" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-gray-700"
                  >
                    <ListChecks className="w-5 h-5 text-orange-600" />
                    My Habits
                  </Link>
                  <Link 
                    to="/add-habit" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg font-bold"
                  >
                    <Plus className="w-5 h-5" />
                    Add Habit
                  </Link>
                  <Link 
                    to="/profile-settings" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-gray-700"
                  >
                    <User className="w-5 h-5 text-orange-600" />
                    Profile Settings
                  </Link>
                </>
              )}
              {!user && (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-all duration-300 font-semibold text-gray-700"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg font-bold"
                  >
                    Register
                  </Link>
                </>
              )}
              <div className="mt-2 px-4">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
