import CTA from "@/components/common/CTA";
import Features from "@/components/common/Features";
import Hero from "@/components/common/Hero";
// import Hero from "@/components/common/Hero";
import HowItWorks from "@/components/common/HowItWorks";
import Testimonials from "@/components/common/Testimonials";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      <Hero />
      {/* Key Features */}
      <Features />
      {/* Testimonial */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
          What Our Users Say
        </h2>
        <Testimonials />
      </div>
      {/* How it works */}
      <HowItWorks />
      {/* CTA */}
      <CTA />
    </main>
  );
}
