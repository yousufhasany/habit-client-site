import Hero from '../components/Hero'
import WhyBuildHabits from '../components/WhyBuildHabits'
import FeaturedHabits from '../components/FeaturedHabits'
import AnimatedSectionA from '../components/AnimatedSectionA'
import AnimatedSectionB from '../components/AnimatedSectionB'

export default function Home() {
  return (
    <div>
      <Hero />
      <main>
        <WhyBuildHabits />
        <FeaturedHabits />
        <AnimatedSectionA />
        <AnimatedSectionB />
      </main>
    </div>
  )
}
