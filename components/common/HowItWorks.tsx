"use client";

import { useState } from 'react';
import { Badge } from '../ui/badge';
import { workflowSteps } from '@/lib/const/data';


const HowItWorks = () => {
    const [activeStep, setActiveStep] = useState(1);
    return (
        <section
            id="how-it-works"
            className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-blue-50/50 relative overflow-hidden"
        >
            <div className="container mx-auto px-4">
                <div className="text-center space-y-6 mb-20">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-4 py-2">
                        How It Works
                    </Badge>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                        Your journey to
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {" "}
                            effortless scheduling
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Follow the interactive timeline to see how TimelyMeet transforms your scheduling workflow
                    </p>
                </div>

                {/* Desktop Timeline */}
                <div className="hidden lg:block max-w-7xl mx-auto">
                    <div className="relative">
                        {/* Timeline Line - Properly Centered */}
                        <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-pink-200 to-orange-200 rounded-full"></div>

                        {/* Timeline Steps - Evenly Spaced */}
                        <div className="relative grid grid-cols-4 gap-0">
                            {workflowSteps.map((step, i) => {
                                const Icon = step.icon
                                const isActive = activeStep === step.id

                                return (
                                    <div
                                        key={step.id}
                                        className="flex flex-col items-center cursor-pointer group px-4"
                                        onMouseEnter={() => setActiveStep(step.id)}
                                    >
                                        {/* Step Circle - Properly Centered */}
                                        <div
                                            className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 transition-all duration-500 relative z-10 ${isActive
                                                ? `bg-gradient-to-r ${step.color} scale-125 shadow-2xl`
                                                : "bg-white border-4 border-gray-200 hover:border-blue-300 hover:scale-110 shadow-lg"
                                                }`}
                                        >
                                            <Icon
                                                className={`w-8 h-8 transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-500"
                                                    }`}
                                            />
                                        </div>

                                        {/* Step Content - Centered and Aligned */}
                                        <div className="text-center max-w-xs">
                                            <h3
                                                className={`font-bold text-lg mb-3 transition-colors duration-300 ${isActive ? "text-gray-900" : "text-gray-600"
                                                    }`}
                                            >
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{step.description}</p>

                                            {/* Expandable Details - Better Positioned */}
                                            <div
                                                className={`transition-all duration-500 ${isActive ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                                                    } overflow-hidden`}
                                            >
                                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                                                    <p className="text-xs text-gray-700 font-medium leading-relaxed">{step.details}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile Timeline */}
                <div className="lg:hidden space-y-8 max-w-2xl mx-auto">
                    {workflowSteps.map((step, i) => {
                        const Icon = step.icon

                        return (
                            <div key={step.id} className="relative">
                                <div className="flex items-start space-x-6 group">
                                    {/* Step Circle */}
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${step.color} shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Step Content */}
                                    <div className="flex-1 group-hover:translate-x-2 transition-transform duration-300">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-gray-600 font-bold text-sm">{i + 1}</span>
                                            </div>
                                            <h3 className="font-bold text-xl text-gray-900">{step.title}</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-gray-100">
                                            <p className="text-sm text-gray-700 font-medium leading-relaxed">{step.details}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Connecting Line */}
                                {i < workflowSteps.length - 1 && (
                                    <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-transparent"></div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks;
