'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Calendar, Menu, PenBox, User, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import UserMenu from './UserMenu';

const HeaderUI = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeStep, setActiveStep] = useState(1)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            TimelyMeet
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {/* <nav className="hidden lg:flex items-center space-x-8">
                        <Link
                            href="#features"
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
                        >
                            Features
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="#testimonials"
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 hover:scale-105 transform"
                        >
                            Testimonials
                        </Link>
                    </nav> */}

                    {/* Desktop CTA */}
                    {/* <div className="hidden lg:flex items-center space-x-4">
                        <Button variant="ghost" className="font-medium hover:scale-105 transition-transform duration-200">
                            Sign In
                        </Button>
                        <Link href="/dashboard">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Get Started Free
                            </Button>
                        </Link>
                    </div> */}
                    <div className="hidden md:flex items-center space-x-4">
                        <SignedOut>
                            <SignInButton forceRedirectUrl="/dashboard">
                                <Button
                                    variant="ghost"
                                    className="font-medium hover:scale-105 transition-transform duration-200 cursor-pointer"
                                >
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton forceRedirectUrl="/dashboard">
                                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                                    Get Started Free
                                </Button>
                            </SignUpButton>
                        </SignedOut>
                        <Link href={"/events?create=true"}>
                            <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Create Event
                            </Button>
                        </Link>
                        <SignedIn>
                            {/* <Link href="/dashboard">
                                <Button variant="ghost" className="font-medium hover:scale-105 transition-transform duration-200">
                                    Dashboard
                                </Button>
                            </Link> */}
                            <UserMenu />
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden border-t bg-white/95 backdrop-blur-md">
                        <div className="px-4 py-6 space-y-4">
                            <Link href="#features" className="block text-gray-600 hover:text-blue-600 font-medium py-2">
                                Features
                            </Link>
                            <Link href="#how-it-works" className="block text-gray-600 hover:text-blue-600 font-medium py-2">
                                How It Works
                            </Link>
                            <Link href="#testimonials" className="block text-gray-600 hover:text-blue-600 font-medium py-2">
                                Testimonials
                            </Link>
                            <Link href="#pricing" className="block text-gray-600 hover:text-blue-600 font-medium py-2">
                                Pricing
                            </Link>
                            <div className="pt-4 space-y-2">
                                <Button variant="outline" className="w-full bg-transparent">
                                    Sign In
                                </Button>
                                <Link href="/dashboard" className="block">
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">Get Started Free</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default HeaderUI
