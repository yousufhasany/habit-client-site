import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AddHabit from './pages/AddHabit'
import MyHabits from './pages/MyHabits'
import BrowsePublicHabits from './pages/BrowsePublicHabits'
import HabitDetails from './pages/HabitDetails'
import ProfileSettings from './pages/ProfileSettings'
import TestAuth from './pages/TestAuth'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Routes wrapped with the main layout (Navbar + Footer) */}
          <Route element={<Layout />}> 
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/browse" element={<BrowsePublicHabits />} />
            <Route path="/test-auth" element={<TestAuth />} />

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/add-habit" element={<AddHabit />} />
              <Route path="/my-habits" element={<MyHabits />} />
              <Route path="/habit/:id" element={<HabitDetails />} />
              <Route path="/profile-settings" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* 404 route should not show Navbar/Footer per requirement */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
