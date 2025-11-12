import { motion } from 'framer-motion'

export default function LoadingSpinner({ message = 'Loading...', size = 'lg' }) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
    xl: 'w-16 h-16'
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] py-10"
    >
      <div className={`loading loading-spinner loading-primary ${sizeClasses[size]}`}></div>
      {message && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600 text-lg"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  )
}
