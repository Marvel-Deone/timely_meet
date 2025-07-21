"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Calendar, Clock, LinkIcon, Star, CheckCircle, Menu, X, Zap, Settings, Share2 } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Hero from "@/components/common/Hero";
import Features from "@/components/common/Features";
import HowItWorks from "@/components/common/HowItWorks";
import TheProblem from "@/components/common/TheProblem";
import Testimonials from "@/components/common/Testimonials";
import CTA from "@/components/common/CTA";

// Mock data - replace with your actual data imports
const features = [
  {
    icon: Calendar,
    title: "Create Events",
    description: "Easily set up and customize your event types with flexible scheduling options.",
  },
  {
    icon: Clock,
    title: "Manage Availability",
    description: "Define your availability to streamline scheduling and avoid conflicts.",
  },
  {
    icon: LinkIcon,
    title: "Custom Links",
    description: "Share your personalized scheduling link and let others book time with you.",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    content:
      "TimelyMeet has revolutionized how our team schedules meetings. It's intuitive and saves us hours every week.",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Michael Chen",
    role: "Startup Founder",
    content: "The best scheduling tool I've used. Clean interface, powerful features, and it just works perfectly.",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Emily Rodriguez",
    role: "Consultant",
    content:
      "My clients love how easy it is to book time with me. TimelyMeet has streamlined my entire booking process.",
    image: "/placeholder.svg?height=48&width=48",
  },
]

const workflowSteps = [
  {
    id: 1,
    title: "Set Your Availability",
    description: "Define when you're free with flexible time blocks and preferences",
    icon: Settings,
    color: "from-blue-500 to-cyan-500",
    details: "Smart calendar integration syncs your existing schedule automatically",
  },
  {
    id: 2,
    title: "Create Event Types",
    description: "Design different meeting types with custom durations and settings",
    icon: Calendar,
    color: "from-purple-500 to-pink-500",
    details: "15-min coffee chats to 2-hour strategy sessions - you control it all",
  },
  {
    id: 3,
    title: "Share Your Link",
    description: "Send your personalized booking link via email, social, or embed it",
    icon: Share2,
    color: "from-green-500 to-emerald-500",
    details: "Beautiful branded booking pages that reflect your professional image",
  },
  {
    id: 4,
    title: "Get Booked Seamlessly",
    description: "Automatic confirmations, reminders, and calendar invites handle the rest",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    details: "Zero back-and-forth emails. Just smooth, professional scheduling",
  },
]

export default function Home() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [activeStep, setActiveStep] = useState(1);

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
