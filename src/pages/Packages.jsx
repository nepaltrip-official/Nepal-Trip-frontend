import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, IndianRupee, Info, Filter, X, ChevronLeft, ChevronRight, Home, Compass } from "lucide-react";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Mountains", "Beach", "Nature", "Honeymoon", "Heritage", "Culture"];

// --- Isolated Skeletons ---
const CardSkeleton = () => (
    <div className="relative w-full h-[70vh] min-h-125 max-h-187.5 md:h-[65vh] rounded-[1.5rem] md:rounded-[2rem] bg-muted/30 overflow-hidden flex flex-col justify-end shadow-2xl p-5 md:p-10 border border-border/40 animate-pulse">
        {/* Floating Navigation Arrows Skeleton (Desktop only) */}
        <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-muted/60" />
        <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-muted/60" />

        {/* Card Content Skeleton */}
        <div className="w-full max-w-3xl z-10">
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                <div className="h-6 md:h-8 w-24 bg-muted/80 rounded-full" />
                <div className="h-6 md:h-8 w-20 bg-muted/80 rounded-full" />
            </div>

            <div className="h-8 md:h-14 w-3/4 bg-muted/80 rounded-xl mb-2 md:mb-4" />

            <div className="space-y-2 mb-5 md:mb-8">
                <div className="h-4 md:h-5 w-full bg-muted/80 rounded-md" />
                <div className="h-4 md:h-5 w-5/6 bg-muted/80 rounded-md" />
            </div>

            <div className="flex items-center justify-between border-t border-muted-foreground/20 pt-4 md:pt-6">
                <div className="space-y-2">
                    <div className="h-3 w-20 bg-muted/80 rounded-md" />
                    <div className="h-6 md:h-8 w-32 bg-muted/80 rounded-md" />
                </div>
                <div className="h-10 md:h-12 w-32 md:w-40 bg-primary/30 rounded-xl md:rounded-2xl" />
            </div>
        </div>
    </div>
);

const DotsSkeleton = () => (
    <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6 mb-2 animate-pulse">
        {[1, 2, 3].map((idx) => (
            <div key={idx} className={`h-1.5 md:h-2 rounded-full bg-muted ${idx === 1 ? 'w-6 md:w-8' : 'w-1.5 md:w-2'}`} />
        ))}
    </div>
);

export default function Packages() {
    const [isLoading, setIsLoading] = useState(true);
    const [packages, setPackages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // UI States
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const filterRef = useRef(null);
    const cardContainerRef = useRef(null);
    const navigate = useNavigate();

    // Interaction states
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [hasSwiped, setHasSwiped] = useState(false);
    const wheelTimeout = useRef(null);

    // Fetch Dummy Data
    useEffect(() => {
        document.title = "Packages — NepalTrip";

        // Simulating data fetching delay
        setTimeout(() => {
            setPackages([
                {
                    id: "1", slug: "ladakh-adventure", title: "Ladakh Himalayan Adventure",
                    category: "Mountains", destination: "Ladakh, India", duration_days: 7, duration_nights: 6,
                    price_inr: 45000,
                    cover_image_mobile: "https://images.unsplash.com/photo-1626714485857-79774681600c?q=80&w=800&h=1200&auto=format&fit=crop",
                    cover_image_desktop: "https://images.unsplash.com/photo-1626714485857-79774681600c?q=80&w=1600&h=900&auto=format&fit=crop",
                    short_description: "A high-altitude journey through monasteries, deep valleys and turquoise lakes."
                },
                {
                    id: "2", slug: "maldives-escape", title: "Maldives Overwater Escape",
                    category: "Beach", destination: "Maldives", duration_days: 5, duration_nights: 4,
                    price_inr: 120000,
                    cover_image_mobile: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&h=1200&auto=format&fit=crop",
                    cover_image_desktop: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1600&h=900&auto=format&fit=crop",
                    short_description: "Overwater villas, coral reefs and endless turquoise horizons."
                },
                {
                    id: "3", slug: "kerala-backwaters", title: "Kerala Backwaters & Beaches",
                    category: "Nature", destination: "Kerala, India", duration_days: 6, duration_nights: 5,
                    price_inr: 32000,
                    cover_image_mobile: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&h=1200&auto=format&fit=crop",
                    cover_image_desktop: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&h=900&auto=format&fit=crop",
                    short_description: "Houseboats, spice hills and the calm rhythm of Gods Own Country."
                }
            ]);
            setIsLoading(false);
        }, 1500);
    }, []);

    // Filter Logic
    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || pkg.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        setCurrentIndex(0);
        setDirection(0);
    }, [searchQuery, selectedCategory]);

    // Click Outside Filter to Close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll Detection for Top/Bottom Nav animations
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent Browser Swipe Back/Forward when hovering the card container
    useEffect(() => {
        const container = cardContainerRef.current;
        if (!container) return;

        const preventBrowserSwipe = (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
            }
        };

        container.addEventListener("wheel", preventBrowserSwipe, { passive: false });
        return () => container.removeEventListener("wheel", preventBrowserSwipe);
    }, [isLoading]);

    // Pagination Logic
    const paginate = (newDirection) => {
        if (newDirection === 1 && currentIndex >= filteredPackages.length - 1) return;
        if (newDirection === -1 && currentIndex <= 0) return;

        setHasSwiped(true);
        setDirection(newDirection);
        setCurrentIndex((prev) => prev + newDirection);
    };

    // Mobile touch drag logic
    const handleDragEnd = (e, { offset }) => {
        const swipeThreshold = 50;
        if (offset.x < -swipeThreshold) {
            paginate(1);
        } else if (offset.x > swipeThreshold) {
            paginate(-1);
        }
    };

    // Laptop Trackpad 2-finger swipe logic
    const handleWheel = (e) => {
        if (wheelTimeout.current) return;
        const swipeThreshold = 30;

        if (e.deltaX > swipeThreshold) {
            paginate(1);
            lockWheel();
        } else if (e.deltaX < -swipeThreshold) {
            paginate(-1);
            lockWheel();
        }
    };

    const lockWheel = () => {
        wheelTimeout.current = setTimeout(() => {
            wheelTimeout.current = null;
        }, 800);
    };

    const handleCardClick = () => {
        if (filteredPackages[currentIndex]) {
            navigate(`/packages/${filteredPackages[currentIndex].slug}`);
        }
    };

    const cardVariants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            scale: 0.95,
            opacity: 0,
            zIndex: 0
        }),
        center: {
            x: 0,
            scale: 1,
            opacity: 1,
            zIndex: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: (direction) => ({
            x: direction < 0 ? "100%" : "-100%",
            scale: 0.95,
            opacity: 0,
            zIndex: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        })
    };

    return (
        <div className="w-full bg-background min-h-[calc(100dvh-4rem)] flex flex-col items-center pt-2 pb-24 md:pb-4 md:pt-6 font-sans relative animate-in fade-in duration-700">

            {/* Top Bar - Static shell loads instantly */}
            <motion.div
                animate={{ y: isScrolled ? -100 : 0, opacity: isScrolled ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm md:max-w-5xl px-4 flex justify-between items-center z-50 mb-3 md:mb-6"
            >
                <div>
                    <h1 className="text-xl md:text-3xl font-black text-foreground drop-shadow-sm tracking-tight">
                        Explore
                    </h1>
                    {/* Only the trip count shimmers while loading */}
                    {isLoading ? (
                        <div className="h-3 md:h-4 w-24 bg-muted animate-pulse rounded-md mt-1.5" />
                    ) : (
                        <p className="text-muted-foreground text-xs md:text-base font-medium">
                            {filteredPackages.length} {filteredPackages.length === 1 ? 'trip' : 'trips'} found
                        </p>
                    )}
                </div>

                <div className="relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="p-2.5 md:p-3.5 bg-card border border-border shadow-sm rounded-full text-foreground hover:bg-muted transition-colors"
                    >
                        {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
                    </button>

                    <AnimatePresence>
                        {isFilterOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-14 right-0 w-70 md:w-96 bg-card border border-border p-5 rounded-2xl shadow-xl flex flex-col gap-5 z-50 origin-top-right"
                            >
                                <div>
                                    <label className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Search Destination</label>
                                    <Input
                                        type="search"
                                        placeholder="E.g., Maldives, Kerala..."
                                        className="w-full h-10 text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Categories</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`rounded-full px-3 py-1.5 text-xs md:text-sm font-medium transition-all ${selectedCategory === cat
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-foreground hover:bg-muted/80"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Immersive Deck Area - Shows skeleton if loading, else shows cards */}
            <div className="flex-1 w-full max-w-sm md:max-w-5xl relative z-10 px-2 md:px-0">
                {isLoading ? (
                    <CardSkeleton />
                ) : (
                    <div
                        ref={cardContainerRef}
                        className="relative w-full h-[70vh] min-h-125 max-h-187.5 md:h-[65vh] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-muted/30 flex items-center justify-center shadow-2xl overscroll-x-none"
                        onWheel={handleWheel}
                    >
                        {/* Mobile Swipe Hints */}
                        {!hasSwiped && filteredPackages.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none md:hidden z-30 text-white/80 font-black text-2xl tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                <span className="animate-pulse">&lt;&lt;&lt;</span>
                                <span className="animate-pulse">&gt;&gt;&gt;</span>
                            </div>
                        )}

                        {filteredPackages.length === 0 ? (
                            <div className="text-center text-muted-foreground p-6">
                                <Info className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 opacity-30" />
                                <p className="text-lg md:text-xl font-bold text-foreground">No matches found</p>
                                <p className="text-xs md:text-sm mt-1">Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <>
                                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                    <motion.div
                                        key={currentIndex}
                                        custom={direction}
                                        variants={cardVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.8}
                                        onDragEnd={handleDragEnd}
                                        onClick={handleCardClick}
                                        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing will-change-transform"
                                        style={{ touchAction: 'pan-y' }}
                                    >
                                        <picture className="absolute inset-0 w-full h-full bg-black">
                                            <source media="(min-width: 768px)" srcSet={filteredPackages[currentIndex].cover_image_desktop} />
                                            <img
                                                src={filteredPackages[currentIndex].cover_image_mobile}
                                                alt={filteredPackages[currentIndex].title}
                                                className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                                                draggable="false"
                                            />
                                        </picture>

                                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 pointer-events-none flex flex-col justify-end">
                                            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                                                <span className="bg-black/50 backdrop-blur-sm text-white px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium border border-white/10 flex items-center gap-1.5">
                                                    <MapPin size={14} /> {filteredPackages[currentIndex].destination}
                                                </span>
                                                <span className="bg-black/50 backdrop-blur-sm text-white px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium border border-white/10 flex items-center gap-1.5">
                                                    <Clock size={14} /> {filteredPackages[currentIndex].duration_days}D / {filteredPackages[currentIndex].duration_nights}N
                                                </span>
                                            </div>

                                            <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 leading-tight drop-shadow-md">
                                                {filteredPackages[currentIndex].title}
                                            </h2>

                                            <p className="text-white/80 text-sm md:text-lg mb-5 md:mb-8 line-clamp-2 md:line-clamp-3 leading-snug max-w-3xl drop-shadow-sm">
                                                {filteredPackages[currentIndex].short_description}
                                            </p>

                                            <div className="flex items-center justify-between border-t border-white/20 pt-4 md:pt-6 pointer-events-auto">
                                                <div className="flex flex-col">
                                                    <span className="text-white/60 text-[10px] md:text-sm font-medium uppercase tracking-wider">Starting From</span>
                                                    <div className="flex items-center text-white font-bold text-xl md:text-3xl drop-shadow-sm mt-0.5">
                                                        <IndianRupee size={24} className="mr-0.5 md:mr-1" strokeWidth={2.5} />
                                                        {filteredPackages[currentIndex].price_inr.toLocaleString('en-IN')}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
                                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-semibold text-sm md:text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Desktop Navigation Arrows */}
                                {currentIndex > 0 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
                                        aria-label="Previous Package"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                )}
                                {currentIndex < filteredPackages.length - 1 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
                                        aria-label="Next Package"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Dots - Dynamic depending on loading state */}
            {isLoading ? (
                <DotsSkeleton />
            ) : (
                filteredPackages.length > 0 && (
                    <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6 mb-2">
                        {filteredPackages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 md:w-8 bg-primary' : 'w-1.5 md:w-2 bg-border hover:bg-border/80'}`}
                            />
                        ))}
                    </div>
                )
            )}

            {/* Bottom Sliding Navbar (Appears on scroll down on mobile - loads instantly) */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: isScrolled ? 0 : 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-full px-6 py-3 flex gap-8 z-50 md:hidden"
            >
                <button onClick={() => navigate('/')} className="flex flex-col items-center text-muted-foreground hover:text-foreground">
                    <Home size={20} />
                    <span className="text-[10px] font-medium mt-1">Home</span>
                </button>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center text-primary">
                    <Compass size={20} />
                    <span className="text-[10px] font-medium mt-1">Explore</span>
                </button>
                <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => setIsFilterOpen(true), 300); }} className="flex flex-col items-center text-muted-foreground hover:text-foreground">
                    <Filter size={20} />
                    <span className="text-[10px] font-medium mt-1">Filter</span>
                </button>
            </motion.div>
        </div>
    );
}