import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebase.init'
import toast from 'react-hot-toast'

export default function TestAuth() {
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testGoogleAuth = async () => {
    setLoading(true)
    setTestResult(null)
    
    console.log('=== Google Authentication Test ===')
    console.log('1. Firebase Auth instance:', auth)
    console.log('2. Google Provider:', googleProvider)
    console.log('3. Firebase Config:', {
      apiKey: auth.config.apiKey ? '✓ Present' : '✗ Missing',
      authDomain: auth.config.authDomain,
      projectId: auth.config.projectId
    })

    try {
      console.log('4. Attempting signInWithPopup...')
      
      // Configure provider
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, googleProvider)
      
      console.log('5. ✓ Success! User data:', {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      })
      
      setTestResult({
        success: true,
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }
      })
      
      toast.success('Google Authentication Working! ✓')
    } catch (error) {
      console.error('5. ✗ Error:', error)
      console.error('Error Code:', error.code)
      console.error('Error Message:', error.message)
      
      let diagnosis = ''
      let solution = ''
      
      switch (error.code) {
        case 'auth/unauthorized-domain':
          diagnosis = 'Domain not authorized in Firebase'
          solution = `Go to Firebase Console → Authentication → Settings → Authorized domains
          Add: localhost and your production domain`
          break
        case 'auth/operation-not-allowed':
          diagnosis = 'Google Sign-in not enabled'
          solution = `Go to Firebase Console → Authentication → Sign-in method
          Enable Google provider`
          break
        case 'auth/popup-blocked':
          diagnosis = 'Browser blocked the popup'
          solution = 'Allow popups for this site in your browser settings'
          break
        case 'auth/popup-closed-by-user':
          diagnosis = 'User closed the popup'
          solution = 'Try again and complete the sign-in process'
          break
        default:
          diagnosis = error.code || 'Unknown error'
          solution = 'Check Firebase configuration and console logs'
      }
      
      setTestResult({
        success: false,
        error: error.message,
        code: error.code,
        diagnosis,
        solution
      })
      
      toast.error('Authentication Failed ✗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔧 Google Authentication Test
          </h1>
          <p className="text-gray-600 mb-6">
            Click the button below to test Google Sign-in functionality
          </p>
          
          <button
            onClick={testGoogleAuth}
            disabled={loading}
            className="w-full btn h-16 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                Testing...
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Test Google Sign-in
              </>
            )}
          </button>
        </div>

        {testResult && (
          <div className={`bg-white rounded-2xl shadow-xl p-8 border-l-4 ${
            testResult.success ? 'border-green-500' : 'border-red-500'
          }`}>
            {testResult.success ? (
              <>
                <h2 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Success! Authentication Working
                </h2>
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">User ID:</p>
                    <p className="text-gray-900 font-mono text-sm">{testResult.user.uid}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Email:</p>
                    <p className="text-gray-900">{testResult.user.email}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Display Name:</p>
                    <p className="text-gray-900">{testResult.user.displayName}</p>
                  </div>
                  {testResult.user.photoURL && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Profile Photo:</p>
                      <img src={testResult.user.photoURL} alt="Profile" className="w-16 h-16 rounded-full" />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Error Detected
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Error Code:</p>
                    <p className="text-red-700 font-mono text-sm">{testResult.code}</p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Error Message:</p>
                    <p className="text-red-700 text-sm">{testResult.error}</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-sm font-semibold text-gray-700 mb-2">⚠️ Diagnosis:</p>
                    <p className="text-gray-900 mb-3">{testResult.diagnosis}</p>
                    <p className="text-sm font-semibold text-gray-700 mb-2">💡 Solution:</p>
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap bg-white p-3 rounded border">{testResult.solution}</pre>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-6 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📋 Firebase Setup Checklist</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <span>Go to <strong>Firebase Console → Authentication</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">2.</span>
              <span>Click <strong>Sign-in method</strong> tab</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">3.</span>
              <span>Enable <strong>Google</strong> provider</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">4.</span>
              <span>Add support email and save</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">5.</span>
              <span>Go to <strong>Settings</strong> tab → <strong>Authorized domains</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">6.</span>
              <span>Add <code className="bg-white px-2 py-1 rounded">localhost</code> if testing locally</span>
            </li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
