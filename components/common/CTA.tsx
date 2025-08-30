import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
    return (
        <section className="py-20 lg:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                        Ready to transform your
                        <br />
                        <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            scheduling experience?
                        </span>
                    </h2>
                    <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                        Join thousands of professionals who have already discovered the power of effortless scheduling.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link href="/dashboard">
                            <Button
                                size="lg"
                                className="cursor-pointer bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                            >
                                Start Free Today
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </Button>
                        </Link>
                        <div className="text-blue-100 text-sm animate-pulse">
                            ✨ No credit card required • Free forever plan available
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA;
