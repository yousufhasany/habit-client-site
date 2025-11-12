import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function AnimatedSectionA() {
  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 p-12 md:p-16 rounded-3xl text-white shadow-2xl overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-3xl">
            <Zap className="w-16 h-16 mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Build Lasting Routines</h3>
            <p className="text-xl text-green-50 leading-relaxed mb-6">
              Use habit trackers and gentle reminders to make routines automatic. Transform your daily actions into lasting success.
            </p>
            <a href="/add-habit" className="btn px-10 py-4 text-lg font-bold bg-white text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white border-none shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 rounded-2xl">
              Start Building Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
