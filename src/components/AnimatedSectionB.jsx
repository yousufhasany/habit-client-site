import { motion } from 'framer-motion'

export default function AnimatedSectionB() {
  return (
    <section className="py-20 bg-gradient-to-b from-base-200 to-base-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-12 md:p-16 rounded-3xl text-white shadow-2xl overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-yellow-300 opacity-20 rounded-full translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="text-5xl mb-6">🌟</div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Join a Thriving Community</h3>
            <p className="text-xl text-pink-50 leading-relaxed mb-6">
              Share challenges, celebrate streaks, and get inspired by thousands of people building better habits every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <a href="/browse" className="btn px-10 py-4 text-lg font-bold bg-white text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white border-none shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 rounded-2xl">
                Browse Community →
              </a>
              <a href="/register" className="btn px-10 py-4 text-lg font-bold btn-outline border-3 border-white text-white hover:bg-white hover:text-orange-600 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl">
                Join Free
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
