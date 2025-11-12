const cards = [
  { 
    title: 'Consistency', 
    desc: 'Small daily actions compound into lasting change.',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    title: 'Focus', 
    desc: 'Reduce decision fatigue by automating healthy routines.',
    icon: '🎪',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    title: 'Progress', 
    desc: 'Track what matters and celebrate wins.',
    icon: '📈',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    title: 'Community', 
    desc: 'Share and learn from others to stay motivated.',
    icon: '🤝',
    color: 'from-orange-500 to-red-500'
  },
]

export default function WhyBuildHabits() {
  return (
    <section className="py-20 bg-gradient-to-b from-base-100 to-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Build Habits?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your life with consistent, purposeful actions that compound over time
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div 
              key={c.title} 
              className="group card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-base-300 overflow-hidden"
            >
              <div className="card-body items-center text-center p-8">
                <div className={`text-5xl mb-4 w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                  {c.icon}
                </div>
                <h3 className="card-title text-2xl font-bold mb-2">{c.title}</h3>
                <p className="text-gray-600">{c.desc}</p>
              </div>
              <div className={`h-1 w-full bg-gradient-to-r ${c.color}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
