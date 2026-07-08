import React, { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

// --- Isolated Skeleton ---
const TestimonialsMasonrySkeleton = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 animate-pulse w-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
                key={i}
                className={`break-inside-avoid relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 md:p-8 shadow-sm ${i % 2 === 0 ? 'h-64' : 'h-72' // Varying heights to mimic masonry look
                    }`}
            >
                {/* Stars Skeleton */}
                <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="h-4 w-4 rounded-sm bg-muted" />
                    ))}
                </div>

                {/* Text Lines Skeleton */}
                <div className="space-y-3 mb-8">
                    <div className="h-4 w-full rounded-md bg-muted" />
                    <div className="h-4 w-full rounded-md bg-muted" />
                    <div className="h-4 w-4/5 rounded-md bg-muted" />
                    {i % 2 !== 0 && <div className="h-4 w-3/4 rounded-md bg-muted" />}
                </div>

                {/* Profile Footer Skeleton */}
                <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                    <div className="flex flex-col gap-2 w-full">
                        <div className="h-3 w-32 rounded-md bg-muted" />
                        <div className="h-2 w-24 rounded-md bg-muted" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default function Testimonials() {
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(timer); // Clean up
    }, []);

    useEffect(() => {
        document.title = "Testimonials — NepalTrip";

        // Simulating data fetch
        setTimeout(() => {
            setItems([
                {
                    id: "t1",
                    rating: 5,
                    message: "Our trip to Kathmandu and Pokhara was flawlessly planned. The mountain flight was an unforgettable memory! Every detail, from the airport pickups to the hotel check-ins, was handled with absolute professionalism.",
                    name: "Aman Malhotra",
                    location: "Delhi, India"
                },
                {
                    id: "t2",
                    rating: 5,
                    message: "Excellent customer service and highly experienced local guides. They understood our custom pacing perfectly and never rushed us during the treks.",
                    name: "Priya Sharma",
                    location: "Mumbai, India"
                },
                {
                    id: "t3",
                    rating: 5,
                    message: "Trekking to Everest Base Camp was a lifelong dream. The team ensured we were acclimatized properly and provided top-notch gear and support. I couldn't have asked for a better crew to guide me to the roof of the world.",
                    name: "Rahul Verma",
                    location: "Bangalore, India"
                },
                {
                    id: "t4",
                    rating: 4,
                    message: "The Chitwan jungle safari was thrilling! We spotted rhinos on our very first day. The eco-lodge they booked for us was stunning and extremely comfortable.",
                    name: "Sneha Kapoor",
                    location: "Pune, India"
                },
                {
                    id: "t5",
                    rating: 5,
                    message: "We booked our honeymoon with NepalTrip and it was magical. The private dinner overlooking the Annapurna range was a massive highlight. Highly recommended for couples looking for a mix of adventure and luxury.",
                    name: "Vikram & Aditi",
                    location: "Hyderabad, India"
                },
                {
                    id: "t6",
                    rating: 5,
                    message: "As a solo female traveler, safety was my biggest concern. The agency made me feel incredibly secure and paired me with a fantastic female guide. A truly empowering experience.",
                    name: "Anjali Desai",
                    location: "Ahmedabad, India"
                }
            ]);
            setIsLoading(false);
        }, 1500);
    }, []);

    // Helper to get initials for the avatar
    const getInitials = (name) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className={`w-full transition-all duration-1000 ease-out transform ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
            <div className="w-full bg-background min-h-[calc(100dvh-4rem)] pt-6 pb-20 font-sans">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Header Section - Static, loads instantly */}
                    <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                        <p className="font-serif text-xs md:text-sm uppercase tracking-widest text-primary mb-2">
                            Kind Words
                        </p>
                        <h1 className="font-serif text-3xl md:text-5xl font-black text-foreground tracking-tight mb-4">
                            Traveler Stories
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Don't just take our word for it. Read what our guests have to say about their Himalayan adventures with us.
                        </p>
                    </div>

                    {/* Masonry Layout for varied-height cards */}
                    {isLoading ? (
                        <TestimonialsMasonrySkeleton />
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 animate-in fade-in duration-700">
                            {items.map((t, idx) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: (idx % 3) * 0.15 }}
                                    className="break-inside-avoid relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Watermark Quote Icon */}
                                    <Quote className="absolute -top-4 -right-4 h-24 w-24 text-muted/20 -rotate-12 pointer-events-none" />

                                    <div className="relative z-10">
                                        {/* Rating Stars */}
                                        <div className="flex gap-1 text-amber-500 mb-4">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={i < t.rating ? "fill-amber-500" : "fill-muted text-muted"}
                                                />
                                            ))}
                                        </div>

                                        {/* Review Text */}
                                        <p className="leading-relaxed text-foreground text-sm md:text-base font-medium mb-6">
                                            "{t.message}"
                                        </p>

                                        {/* Traveler Profile Footer */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                                                {getInitials(t.name)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-foreground">{t.name}</span>
                                                {t.location && (
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        {t.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}