import { useEffect, useState } from 'react'
import axios from 'axios'
import { Star, Eye, Flame, ArrowRight, Sparkles, Dumbbell, Zap, Brain, BookOpen, Target } from 'lucide-react'

export default function FeaturedHabits() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // Fetch public habits from MongoDB backend
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const response = await axios.get(`${apiUrl}/habits/public`)
        if (cancelled) return
        
        // Get first 6 habits for featured section
        const featuredHabits = response.data.slice(0, 6)
        setHabits(featuredHabits)
      } catch (err) {
        console.error('FeaturedHabits: failed to load habits', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section id="featured" className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-200 rounded-full text-base font-bold mb-6 shadow-md">
            <Star className="w-5 h-5 text-orange-600 animate-pulse fill-orange-600" />
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Popular Habits
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Featured Habits
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the most popular habits from our community and get inspired to start your own journey
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center bg-white p-10 rounded-3xl shadow-2xl">
              <div className="relative inline-block">
                <span className="loading loading-spinner loading-lg text-orange-600"></span>
                <div className="absolute inset-0 loading loading-spinner loading-lg text-red-600 opacity-50 blur-sm"></div>
              </div>
              <p className="mt-6 text-lg font-semibold text-gray-700">Loading amazing habits...</p>
              <p className="mt-2 text-sm text-gray-500">Get ready to be inspired! ✨</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {habits.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-xl">
                <div className="flex justify-center mb-6">
                  <BookOpen className="w-32 h-32 text-gray-300 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No featured habits yet</h3>
                <p className="text-gray-500">Be the first to create an amazing habit!</p>
              </div>
            )}
            {habits.map((h, index) => (
              <article 
                key={h._id} 
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-gray-100 hover:border-orange-200 overflow-hidden"
                style={{ 
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  animationDelay: `${index * 0.15}s`,
                  opacity: 0
                }}
              >
                {/* Popular Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                    <Flame className="w-4 h-4" /> Trending
                  </div>
                </div>

                {/* Decorative Top Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>

                {/* Beautiful Hero Image */}
                {h.imageUrl ? (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={h.imageUrl}
                      alt={h.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                ) : (
                  <div className={`h-48 relative overflow-hidden ${
                    index % 6 === 0 ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                    index % 6 === 1 ? 'bg-gradient-to-br from-blue-400 to-cyan-600' :
                    index % 6 === 2 ? 'bg-gradient-to-br from-purple-400 to-pink-600' :
                    index % 6 === 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-600' :
                    index % 6 === 4 ? 'bg-gradient-to-br from-red-400 to-pink-600' :
                    'bg-gradient-to-br from-orange-400 to-red-600'
                  }`}>
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
                    {/* Large Centered Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        {index % 6 === 0 ? <Dumbbell className="w-24 h-24 text-white drop-shadow-2xl" /> : 
                         index % 6 === 1 ? <Zap className="w-24 h-24 text-white drop-shadow-2xl" /> : 
                         index % 6 === 2 ? <Brain className="w-24 h-24 text-white drop-shadow-2xl" /> : 
                         index % 6 === 3 ? <BookOpen className="w-24 h-24 text-white drop-shadow-2xl" /> : 
                         index % 6 === 4 ? <Target className="w-24 h-24 text-white drop-shadow-2xl" /> : 
                         <Sparkles className="w-24 h-24 text-white drop-shadow-2xl" />}
                      </div>
                    </div>
                    {/* Corner Decorations */}
                    <div className="absolute top-4 right-4">
                      <Sparkles className="w-6 h-6 text-white/70 animate-pulse" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Star className="w-6 h-6 text-white/60 fill-white/60 animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>
                  </div>
                )}

                <div className="p-6">

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                    {h.title || 'Untitled Habit'}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {h.description || 'No description provided.'}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{Math.floor(Math.random() * 500) + 100}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span className="font-semibold">{Math.floor(Math.random() * 2000) + 500}</span>
                    </div>
                  </div>

                  {/* Author & CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold">{(h.authorName || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created by</p>
                        <p className="text-sm font-semibold text-gray-700">{h.authorName || 'Unknown'}</p>
                      </div>
                    </div>
                    <a 
                      className="btn px-5 py-2 text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-xl transform hover:scale-110 transition-all duration-300 rounded-xl flex items-center gap-1" 
                      href={`/habit/${h._id}`}
                    >
                      View
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {habits.length > 0 && (
          <div className="text-center mt-16">
            <div className="inline-flex flex-col items-center gap-4">
              <p className="text-gray-600 text-lg">Want to see more amazing habits?</p>
              <a href="/browse" className="group relative btn px-12 py-5 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white border-none hover:from-orange-600 hover:to-red-600 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 rounded-2xl overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  Browse All Habits
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
