import { Target, Rocket } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white py-24 md:py-32 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
          <Target className="w-4 h-4" /> Transform Your Life With Better Habits
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          Build Better Habits,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            One Day at a Time
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100 leading-relaxed">
          Track your progress, stay consistent, and watch yourself improve every single day. Join thousands building lasting habits.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <a href="/register" className="btn px-8 py-4 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white border-none shadow-xl hover:shadow-2xl hover:from-orange-600 hover:to-red-600 transform hover:scale-110 transition-all duration-300 rounded-2xl inline-flex items-center gap-2">
            Get Started Free <Rocket className="w-5 h-5" />
          </a>
          <a href="#featured" className="btn px-8 py-4 text-xl font-bold btn-outline border-3 border-white text-white hover:bg-white hover:text-orange-600 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl">
            Explore Habits
          </a>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">10K+</div>
            <div className="text-blue-200 text-sm">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">50K+</div>
            <div className="text-blue-200 text-sm">Habits Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">95%</div>
            <div className="text-blue-200 text-sm">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
