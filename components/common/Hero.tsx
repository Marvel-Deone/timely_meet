'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative container mx-auto px-4 py-20 lg:py-32">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div
                        className={`lg:w-1/2 space-y-8 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                    >
                        <div className="space-y-6">
                            <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 animate-bounce"
                            >
                                ✨ Trusted by 10,000+ professionals
                            </Badge>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                                    Schedule
                                </span>
                                <br />
                                <span className="text-gray-900">meetings that</span>
                                <br />
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient delay-500">
                                    matter
                                </span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                                Transform your scheduling experience with TimelyMeet. Beautiful, intelligent, and effortlessly simple.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/dashboard">
                                <Button
                                    size="lg"
                                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                                >
                                    Start Free Today
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                                </Button>
                            </Link>
                            <Button
                                size="lg"
                                variant="outline"
                                className="cursor-pointer border-2 border-gray-300 hover:border-blue-300 px-8 py-4 text-lg font-semibold bg-white/80 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                            >
                                Watch Demo
                            </Button>
                        </div>

                        <div className="flex items-center space-x-8 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Free forever plan</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>No credit card required</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div
                        className={`lg:w-1/2 flex justify-center transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur-2xl opacity-20 scale-105 animate-pulse"></div>
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md hover:scale-105 transition-transform duration-500">
                                <Image
                                    src="/images/poster.png"
                                    alt="TimelyMeet Dashboard Preview"
                                    width={400}
                                    height={400}
                                    className="rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;
