import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
            <div className="lg:w-1/2">
                <h1 className="text-6xl md:text-7xl font-extrabold pb-6 bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text tracking-tighter text-transparent pr-2">Fast, easy scheduling</h1>
                <p className="text-xl text-gray-600 mb-10">TimelyMeet is a modern scheduling tool that makes it effortless to book meetings, manage availability, and stay organized — all in one place.</p>
                <Link href='/dashboard'>
                    <Button size="lg" className="!bg-blue-600 text-lg cursor-pointer">
                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
            {/* Poster */}
            <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md aspect-square">
                    <Image src="/images/poster.png" alt="Scheduling illustration" layout="fill" objectFit="contain" />
                </div>
            </div>
        </div>
    )
}

export default Hero;
