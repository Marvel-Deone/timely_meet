"use client"

import { useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/const/data";

const Testimonials = () => {
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false })
    );

    return (
        //     <Carousel
        //         opts={{
        //             align: "start",
        //         }}
        //         plugins={[plugin.current]}
        //         className="w-full mx-auto"
        //     >
        //         <CarouselContent>
        //             {testimonials.map((testimonial, index) => (
        //                 <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
        //                     <Card className="h-full">
        //                         <CardContent className="flex flex-col justify-between h-full px-6">
        //                             <p className="text-gray-600 mb-4">&quot;{testimonial.content}&quot;</p>
        //                             <div className="flex items-center mt-4">
        //                                 <Avatar className="h-12 w-12 mr-4 !rounded-full">
        //                                     <AvatarImage src={testimonial.image} alt={testimonial.name} className="!rounded-full" />
        //                                     <AvatarFallback>
        //                                         {testimonial.name
        //                                             .split(" ")
        //                                             .map((n) => n[0])
        //                                             .join(" ")}
        //                                     </AvatarFallback>
        //                                 </Avatar>
        //                                 <div>
        //                                     <p className="font-semibold">{testimonial.name}</p>
        //                                     <p className="test-sn text-gray-500">{testimonial.role}</p>
        //                                 </div>
        //                             </div>
        //                         </CardContent>
        //                     </Card>
        //                 </CarouselItem>
        //             )
        //             )}
        //         </CarouselContent>
        //         {/* <CarouselPrevious />
        //   <CarouselNext /> */}
        //     </Carousel>

        <section id="testimonials" className="py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-6 mb-16">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 px-4 py-2">
                        Testimonials
                    </Badge>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                        Loved by
                        <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                            {" "}
                            professionals worldwide
                        </span>
                    </h2>
                </div>

                <Carousel
                    opts={{ align: "start", loop: true }}
                    plugins={[plugin.current]}
                    className="w-full max-w-5xl mx-auto"
                >
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <Card className="h-full border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                                    <CardContent className="p-8">
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-pulse"
                                                    style={{ animationDelay: `${i * 100}ms` }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                                        <div className="flex items-center">
                                            <Avatar className="h-12 w-12 mr-4 rounded-full overflow-hidden">
                                                <AvatarImage
                                                    src={testimonial.image || "/placeholder.svg"}
                                                    alt={testimonial.name}
                                                    className="rounded-full"
                                                />
                                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full flex items-center justify-center w-12 h-12">
                                                    {testimonial.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-gray-900">{testimonial.name}</p>
                                                <p className="text-gray-600">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}

export default Testimonials;