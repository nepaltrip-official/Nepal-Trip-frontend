import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Heart, ShieldCheck, Star, Map } from "lucide-react";
import { Button } from "../../components/ui/button";
import { InquiryDialog } from "../../components/site/InquiryDialog";

// --- Isolated Skeletons ---
const TestimonialsSkeleton = () => (
    <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
            <div className="h-10 w-64 rounded-md bg-muted mt-1 animate-pulse" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm animate-pulse">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div key={s} className="h-4 w-4 rounded-sm bg-muted" />
                            ))}
                        </div>
                        <div className="space-y-2 mt-4">
                            <div className="h-4 w-full rounded-md bg-muted" />
                            <div className="h-4 w-5/6 rounded-md bg-muted" />
                        </div>
                        <div className="flex flex-col gap-1 mt-5">
                            <div className="h-4 w-32 rounded-md bg-muted" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [testimonials, setTestimonials] = useState([]);

    // 1. ADD MOUNT STATE FOR GUARANTEED TRANSITION
    const [isMounted, setIsMounted] = useState(false);

    const [settings] = useState({
        brand_name: "Nepal Trip",
        tagline: "CURATED JOURNEYS, UNFORGETTABLE MEMORIES",
        hero_title: "Journeys crafted for the way you travel",
        hero_subtitle: "Handpicked tour packages across breathtaking destinations. Tell us where you dream of going — we handle the rest.",
    });

    useEffect(() => {
        document.title = "Nepal Trip";

        // 2. TRIGGER ANIMATION EXACTLY 50MS AFTER DOM PAINT
        const mountTimer = setTimeout(() => setIsMounted(true), 50);

        const fetchData = async () => {
            setTimeout(() => {
                setTestimonials([
                    { id: 1, rating: 5, message: "Flawlessly planned. An unforgettable memory!", name: "Aman M.", location: "Delhi" },
                    { id: 2, rating: 5, message: "Highly experienced local guides. Perfect pacing.", name: "Priya S.", location: "Mumbai" },
                ]);
                setIsLoading(false);
            }, 1500);
        };

        fetchData();
        return () => clearTimeout(mountTimer);
    }, []);

    const galleryPreview = [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=800&auto=format&fit=crop",
    ];

    return (
        // 3. APPLY STANDARD TAILWIND TRANSITION CLASSES BOUND TO STATE
        <div
            className={`w-full transition-all duration-1000 ease-out transform ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
        >
            {/* Hero - Loads Instantly */}
            <section className="relative isolate overflow-hidden min-h-[80vh] flex flex-col justify-center">
                <video autoPlay loop muted playsInline className="absolute inset-0 -z-10 h-full w-full object-cover hidden md:block">
                    <source src="/nepal-landscape.mp4" type="video/mp4" />
                </video>
                <video autoPlay loop muted playsInline className="absolute inset-0 -z-10 h-full w-full object-cover block md:hidden">
                    <source src="/nepal-portrait.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/60 via-black/40 to-black/70" />

                <div className="mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 sm:py-40 lg:px-8 lg:py-52">
                    <div className="max-w-2xl text-primary-foreground">
                        <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest backdrop-blur">
                            {settings.tagline}
                        </span>
                        <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                            {settings.hero_title}
                        </h1>
                        <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
                            {settings.hero_subtitle}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <InquiryDialog
                                trigger={
                                    <Button size="lg" className="bg-accent px-8 text-accent-foreground hover:bg-accent/90 transition-transform active:scale-95">
                                        Plan my trip
                                    </Button>
                                }
                            />
                            <Link to="/packages">
                                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 transition-transform active:scale-95">
                                    Browse packages <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why us - Loads Instantly */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        { icon: Compass, title: "Handcrafted itineraries", body: "Every trip is designed around what you love — no cookie-cutter tours." },
                        { icon: ShieldCheck, title: "Trusted since 2015", body: "Thousands of travelers, five-star reviews and full on-trip support." },
                        { icon: Heart, title: "Local partners", body: "We work with local guides and hosts so your money reaches the community." },
                    ].map((f) => (
                        <div key={f.title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                            <f.icon className="h-8 w-8 text-accent" />
                            <h3 className="mt-4 font-serif text-xl text-foreground">{f.title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Visual Gallery Preview - Loads Instantly */}
            <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="font-serif text-sm uppercase tracking-widest text-accent">Through our lens</p>
                        <h2 className="mt-1 font-serif text-3xl sm:text-4xl text-foreground">Glimpses of Nepal</h2>
                    </div>
                    <Link to="/gallery">
                        <Button variant="ghost" className="text-primary hover:bg-primary/5 hover:text-accent transition-colors">
                            View full gallery <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {galleryPreview.map((src, idx) => (
                        <div key={idx} className={`relative overflow-hidden rounded-2xl group ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                            <div className="aspect-4/3 md:aspect-auto md:h-full w-full bg-muted">
                                <img
                                    src={src}
                                    alt={`Gallery preview ${idx + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials - Shimmers While Loading */}
            {isLoading ? (
                <TestimonialsSkeleton />
            ) : testimonials.length > 0 ? (
                <section className="bg-secondary/40 py-20 transition-opacity duration-500">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <p className="font-serif text-sm uppercase tracking-widest text-accent">Kind words</p>
                        <h2 className="mt-1 font-serif text-3xl sm:text-4xl text-foreground">Loved by travelers</h2>
                        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((t) => (
                                <blockquote key={t.id} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex gap-1 text-accent">
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                    <p className="mt-3 text-sm leading-relaxed text-foreground">“{t.message}”</p>
                                    <footer className="mt-4 text-sm">
                                        <span className="font-medium text-foreground">{t.name}</span>
                                        <span className="text-muted-foreground"> · {t.location}</span>
                                    </footer>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {/* CTA - Loads Instantly */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-primary-foreground sm:px-16 sm:py-20 shadow-xl">
                    <div className="absolute -right-20 -top-20 opacity-10">
                        <Map className="h-96 w-96" />
                    </div>
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                        <div className="max-w-xl">
                            <p className="font-serif text-sm uppercase tracking-widest text-accent">Know before you go</p>
                            <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                                Haven't decided where to go yet? Let's fix that.
                            </h2>
                            <p className="mt-4 text-base text-primary-foreground/80 sm:text-lg">
                                Explore local trivia, practical travel insights, and discover the perfect destination based on your vibe—no bookings required, just pure inspiration.
                            </p>
                        </div>
                        <Link to="/discover" className="shrink-0">
                            <Button size="lg" className="bg-accent px-8 text-lg text-accent-foreground hover:bg-accent/90 shadow-lg transition-transform active:scale-95">
                                Discover Destinations
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}