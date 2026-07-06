import React, { useEffect } from "react";

export default function Gallery() {
    useEffect(() => {
        document.title = "Gallery — NepalTrip";
    }, []);

    // A beautiful mix of portrait and landscape images to show off the masonry effect
    const images = [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?q=80&w=800&h=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=800&h=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=600&h=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1585675100414-22d71f11cb23?q=80&w=800&h=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544735716-95cb4d5ef130?q=80&w=800&auto=format&fit=crop",
    ];

    return (
        <div className="w-full bg-background/50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="font-serif text-sm uppercase tracking-widest text-accent">Visual Journey</p>
                    <h1 className="mt-2 font-serif text-4xl sm:text-5xl">The Beauty of Nepal</h1>
                    <p className="mt-4 text-muted-foreground text-lg">
                        Get lost in the vibrant colors, towering peaks, and timeless culture of the Himalayas.
                    </p>
                </div>

                {/* CSS Masonry Layout */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((src, index) => (
                        <div key={index} className="break-inside-avoid relative group overflow-hidden rounded-2xl shadow-sm border border-border/40 bg-card">
                            <img
                                src={src}
                                alt={`Nepal gallery ${index + 1}`}
                                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            {/* Optional hover overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}