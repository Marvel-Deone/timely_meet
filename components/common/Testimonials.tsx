"use client"

import { useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { testimonials } from "@/lib/consts/data";

const Testimonials = () => {
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false })
    );

    return (
        <Carousel
            opts={{
                align: "start",
            }}
            plugins={[plugin.current]}
            className="w-full mx-auto"
        >
            <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full">
                            <CardContent className="flex flex-col justify-between h-full px-6">
                                <p className="text-gray-600 mb-4">&quot;{testimonial.content}&quot;</p>
                                <div className="flex items-center mt-4">
                                    <Avatar className="h-12 w-12 mr-4 !rounded-full">
                                        <AvatarImage src={testimonial.image} alt={testimonial.name} className="!rounded-full" />
                                        <AvatarFallback>
                                            {testimonial.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join(" ")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="test-sn text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                )
                )}
            </CarouselContent>
            {/* <CarouselPrevious />
      <CarouselNext /> */}
        </Carousel>
    )
}

export default Testimonials;