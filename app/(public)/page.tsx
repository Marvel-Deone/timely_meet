import Hero from "@/components/common/Hero";
import Features from "@/components/common/Features";
import HowItWorks from "@/components/common/HowItWorks";
import TheProblem from "@/components/common/TheProblem";
import Testimonials from "@/components/common/Testimonials";
import CTA from "@/components/common/CTA";

const Home = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* How It Works - Interactive Timeline */}
      <HowItWorks />

      {/* Transform Your Scheduling Chaos */}
      <TheProblem />

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA */}
      <CTA />
    </div>
  )
}

export default Home;