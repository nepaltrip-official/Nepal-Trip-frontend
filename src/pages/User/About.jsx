import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Compass, Shield, Heart, Map, Star, Users } from "lucide-react";

// --- Isolated Skeletons ---
const AboutHeroSkeleton = () => (
    <div className="relative w-full h-[40vh] min-h-75 md:h-[50vh] rounded-[2rem] bg-muted/60 animate-pulse flex flex-col items-center justify-center p-6">
        <div className="h-6 w-24 bg-muted-foreground/20 rounded-full mb-4" />
        <div className="h-10 md:h-14 lg:h-16 w-3/4 max-w-2xl bg-muted-foreground/20 rounded-xl mb-2" />
        <div className="h-10 md:h-14 lg:h-16 w-2/3 max-w-xl bg-muted-foreground/20 rounded-xl" />
    </div>
);

const AboutTextSkeleton = () => (
    <div className="animate-pulse flex flex-col items-center md:items-center text-left md:text-center w-full">
        <div className="h-8 md:h-10 w-3/4 max-w-md bg-muted rounded-xl mb-8 mx-auto" />
        <div className="space-y-3 w-full max-w-3xl">
            <div className="h-4 md:h-5 w-full bg-muted rounded-md" />
            <div className="h-4 md:h-5 w-full bg-muted rounded-md" />
            <div className="h-4 md:h-5 w-11/12 bg-muted rounded-md mx-auto md:mx-0" />
            <div className="h-4 md:h-5 w-full bg-muted rounded-md mt-6" />
            <div className="h-4 md:h-5 w-4/5 bg-muted rounded-md mx-auto md:mx-0" />
        </div>
    </div>
);

// Custom Animated Counter Component
const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = "", label, icon: Icon }) => {
    const nodeRef = useRef();
    const inView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (inView) {
            const controls = animate(from, to, {
                duration: duration,
                ease: "easeOut",
                onUpdate(value) {
                    if (nodeRef.current) {
                        nodeRef.current.textContent = Math.floor(value) + suffix;
                    }
                }
            });
            return () => controls.stop();
        }
    }, [inView, from, to, duration, suffix]);

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-card border border-border/50 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-primary/10 text-primary rounded-full mb-4">
                <Icon size={24} />
            </div>
            <div ref={nodeRef} className="font-serif text-4xl md:text-5xl text-foreground font-bold drop-shadow-sm">
                {from}{suffix}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground mt-2 font-bold uppercase tracking-widest text-center">
                {label}
            </div>
        </div>
    );
};

export default function About() {
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        document.title = "About Us — NepalTrip";

        // Simulating data fetch
        setTimeout(() => {
            setSettings({
                brand_name: "Nepal Trip",
                about_title: "Crafting Unforgettable Himalayan Journeys",
                about_body: "We are a passionate team of travel curators helping thousands of travelers discover the world since 2015. \n\nBorn out of a deep love for the Himalayas, our mission is to connect travelers with the authentic heart of Nepal. We don't just book tours; we design experiences that challenge, inspire, and transform you. From the bustling alleys of Kathmandu to the serene heights of Everest Base Camp, every itinerary is meticulously crafted by locals who know the terrain like the back of their hand.",
                hero_image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1920&auto=format&fit=crop"
            });
            setIsLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(timer); // Clean up
    }, []);

    const values = [
        { icon: Compass, title: "Expert Local Guides", description: "Our guides are born and raised in the mountains, offering you untold stories and unmatched safety." },
        { icon: Heart, title: "Sustainable Travel", description: "We partner strictly with eco-friendly lodges and ensure a portion of our profits goes to local village schools." },
        { icon: Shield, title: "100% Financial Protection", description: "Your bookings are completely secure. We provide full transparency with zero hidden costs, ever." }
    ];

    return (
        <div className={`w-full transition-all duration-1000 ease-out transform ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
            <div className="w-full bg-background min-h-screen pb-20 font-sans">
                {/* Cinematic Hero Section */}
                <section className="px-4 pt-6 pb-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {isLoading ? (
                        <AboutHeroSkeleton />
                    ) : (
                        <div className="relative w-full h-[40vh] min-h-75 md:h-[50vh] rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-700">
                            <img src={settings.hero_image} alt="Himalayan landscape" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30 mb-4"
                                >
                                    Our Story
                                </motion.span>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                    className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl leading-tight drop-shadow-lg"
                                >
                                    We bring you closer to the roof of the world.
                                </motion.h1>
                            </div>
                        </div>
                    )}
                </section>

                {/* Dynamic Stats Section - Static shell loads instantly */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <AnimatedCounter to={5000} suffix="+" label="Happy Travelers" icon={Users} />
                        <AnimatedCounter to={40} suffix="+" label="Unique Destinations" icon={Map} />
                        <AnimatedCounter to={9} suffix=" yrs" label="Of Travel Craft" icon={Star} />
                    </div>
                </section>

                {/* Core About Content */}
                <section className="max-w-4xl mx-auto px-4 py-16 md:py-24 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <p className="font-serif text-sm uppercase tracking-widest text-primary mb-3">Who We Are</p>
                    {isLoading ? (
                        <AboutTextSkeleton />
                    ) : (
                        <div className="animate-in fade-in duration-700 w-full">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
                                {settings.about_title}
                            </h2>
                            <div className="text-base md:text-lg text-muted-foreground leading-relaxed text-left md:text-center space-y-6">
                                {settings.about_body.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Expanded Content: Core Values - Static layout loads instantly */}
                <section className="bg-muted/30 py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Why Travel With Us?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We believe travel should be more than just checking boxes. It should be safe, sustainable, and deeply enriching.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                            {values.map((value, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.15 }}
                                    className="flex flex-col items-center text-center p-6 rounded-3xl bg-card border border-border/50 shadow-sm"
                                >
                                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 transform -rotate-3 transition-transform hover:rotate-0">
                                        <value.icon size={32} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">{value.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}