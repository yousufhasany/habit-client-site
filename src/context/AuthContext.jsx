import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/firebase.init'
import axios from 'axios'

const AuthContext = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      
      // Generate JWT token when user logs in
      if (u?.email) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
          const response = await axios.post(`${apiUrl}/jwt`, {
            email: u.email,
            name: u.displayName || u.email
          })
          
          if (response.data.token) {
            localStorage.setItem('habit-tracker-token', response.data.token)
          }
        } catch (error) {
          console.error('Error generating JWT:', error)
        }
      } else {
        // Remove token when user logs out
        localStorage.removeItem('habit-tracker-token')
      }
      
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
