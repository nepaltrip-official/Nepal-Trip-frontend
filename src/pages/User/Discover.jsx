import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, Mountain, Calendar, CloudSun, ChevronLeft, ChevronRight, X, Filter, Home, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

const filters = ["All", "Culture & City", "High Altitude Trekking", "Wildlife & Jungle"];

const destinations = [
    {
        name: "Kathmandu Valley",
        vibe: "Culture & City",
        image: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?q=80&w=1600&auto=format&fit=crop",
        trivia: "Home to 7 UNESCO World Heritage sites within a 15km radius. It's often called the 'living museum' of the world.",
        altitude: "1,400m",
        bestTime: "Sept-Nov & Feb-Apr",
        weather: "Mild days, chilly nights"
    },
    {
        name: "Everest Base Camp",
        vibe: "High Altitude Trekking",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop",
        trivia: "You lose about 30% of your oxygen capacity at Base Camp. Acclimatization days aren't optional—they are life-saving!",
        altitude: "5,364m",
        bestTime: "Pre-monsoon (Mar-May)",
        weather: "Extremely cold"
    },
    {
        name: "Chitwan National Park",
        vibe: "Wildlife & Jungle",
        image: "https://images.unsplash.com/photo-1585675100414-22d71f11cb23?q=80&w=1600&auto=format&fit=crop",
        trivia: "One of the last safe havens for the One-Horned Rhinoceros and the elusive Royal Bengal Tiger.",
        altitude: "150m",
        bestTime: "Oct-Mar (Dry season)",
        weather: "Tropical & warm"
    },
    {
        name: "Pokhara Lakeside",
        vibe: "Culture & City",
        image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1600&auto=format&fit=crop",
        trivia: "The adventure capital of Nepal. You can paraglide alongside eagles with the Annapurna range as your backdrop.",
        altitude: "822m",
        bestTime: "Sept-Nov",
        weather: "Pleasant, rainy monsoon"
    }
];

export default function Discover() {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    // UI states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const filterRef = useRef(null);

    // Interaction states
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [hasSwiped, setHasSwiped] = useState(false);
    const [showTrivia, setShowTrivia] = useState(false);

    const wheelTimeout = useRef(null);
    const triviaTimeout = useRef(null);
    const cardContainerRef = useRef(null);
    const triviaRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        document.title = "Discover Nepal — NepalTrip";
        // Simulate a YouTube-style dynamic loading delay
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(timer); // Clean up
    }, []);

    // Scroll Detection for Top/Bottom Nav animations
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const filteredDestinations = activeFilter === "All"
        ? destinations
        : destinations.filter(d => d.vibe === activeFilter);

    // Reset index when filter changes
    useEffect(() => {
        setCurrentIndex(0);
        setDirection(0);
        setShowTrivia(false);
    }, [activeFilter]);

    // Handle global clicks to hide trivia or filter when clicking anywhere else
    useEffect(() => {
        const handleGlobalClick = (e) => {
            if (showTrivia && triviaRef.current && !triviaRef.current.contains(e.target)) {
                setShowTrivia(false);
            }
            if (isFilterOpen && filterRef.current && !filterRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };

        const delayTimer = setTimeout(() => {
            document.addEventListener("mousedown", handleGlobalClick);
        }, 50);

        return () => {
            clearTimeout(delayTimer);
            document.removeEventListener("mousedown", handleGlobalClick);
        };
    }, [showTrivia, isFilterOpen]);

    // Prevent Browser Swipe Back/Forward
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
    }, [loading]);

    // Pagination Logic
    const paginate = (newDirection) => {
        if (newDirection === 1 && currentIndex >= filteredDestinations.length - 1) return;
        if (newDirection === -1 && currentIndex <= 0) return;

        setHasSwiped(true);
        setDirection(newDirection);
        setCurrentIndex((prev) => prev + newDirection);
        setShowTrivia(false);
    };

    const handleDragEnd = (e, { offset }) => {
        const swipeThreshold = 50;
        if (offset.x < -swipeThreshold) {
            paginate(1);
        } else if (offset.x > swipeThreshold) {
            paginate(-1);
        }
    };

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

    // Handle interactive trivia display toggle
    const toggleTrivia = (e) => {
        e.stopPropagation();
        if (showTrivia) {
            setShowTrivia(false);
            if (triviaTimeout.current) clearTimeout(triviaTimeout.current);
        } else {
            setShowTrivia(true);
            triviaTimeout.current = setTimeout(() => {
                setShowTrivia(false);
            }, 10000);
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
        <div className={`w-full transition-all duration-1000 ease-out transform ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`
        } >
            <div className="w-full bg-background min-h-[calc(100dvh-4rem)] flex flex-col items-center pt-2 pb-6 md:pt-6 md:pb-16 font-sans relative overflow-hidden">

                {/* Global style override to hide the footer specifically on mobile for this page */}
                <style>{`
                @media (max-width: 767px) {
                    footer {
                        display: none !important;
                    }
                }
            `}</style>

                {/* Header & Funnel Filters - Fades and slides up on scroll, Lowered z-index to 30 */}
                <motion.div
                    animate={{ y: isScrolled ? -100 : 0, opacity: isScrolled ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-full md:max-w-5xl px-4 flex justify-between items-center z-30 mb-3 md:mb-6 relative"
                >
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-foreground drop-shadow-sm tracking-tight">
                            Discover Your Vibe
                        </h1>
                        <p className="text-muted-foreground text-xs md:text-base font-medium">
                            {activeFilter === "All" ? "All destinations" : activeFilter} ({filteredDestinations.length})
                        </p>
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
                                    className="absolute top-14 right-0 w-[85vw] max-w-75 md:w-80 bg-card border border-border p-5 rounded-2xl shadow-xl flex flex-col gap-4 z-50 origin-top-right"
                                >
                                    <div>
                                        <label className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Filter by Vibe</label>
                                        <div className="flex flex-col gap-2">
                                            {filters.map(filter => (
                                                <button
                                                    key={filter}
                                                    onClick={() => { setActiveFilter(filter); setIsFilterOpen(false); }}
                                                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeFilter === filter
                                                        ? "bg-[#2A5244] text-white"
                                                        : "bg-muted/50 text-foreground hover:bg-muted"
                                                        }`}
                                                >
                                                    {filter}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Immersive Swipeable Deck Area */}
                <div className="flex-1 w-full max-w-full md:max-w-5xl relative z-10 px-3 md:px-0">

                    {/* YouTube-Style Shimmer Skeleton Loader */}
                    {loading ? (
                        <div className="w-full h-[calc(100dvh-13rem)] min-h-100 max-h-200 md:h-[65vh] md:min-h-125 md:max-h-187.5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-muted/40 p-6 flex flex-col justify-end gap-4 animate-pulse relative shadow-2xl">
                            <div className="h-6 w-24 bg-foreground/10 rounded-full" />
                            <div className="h-10 w-3/4 bg-foreground/10 rounded-xl" />
                            <div className="h-16 w-full bg-foreground/10 rounded-2xl mt-2" />
                            <div className="flex gap-3 mt-2">
                                <div className="h-8 w-24 bg-foreground/10 rounded-lg" />
                                <div className="h-8 w-24 bg-foreground/10 rounded-lg" />
                                <div className="h-8 w-24 bg-foreground/10 rounded-lg" />
                            </div>
                        </div>
                    ) : (
                        <div
                            ref={cardContainerRef}
                            className="relative w-full h-[calc(100dvh-13rem)] min-h-100 max-h-200 md:h-[65vh] md:min-h-125 md:max-h-187.5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-muted/30 flex items-center justify-center shadow-2xl overscroll-x-none"
                            onWheel={handleWheel}
                        >

                            {/* Mobile Swipe Hints */}
                            {!hasSwiped && filteredDestinations.length > 1 && (
                                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none md:hidden z-30 text-white/80 font-black text-2xl tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                    <span className="animate-pulse">&lt;&lt;&lt;</span>
                                    <span className="animate-pulse">&gt;&gt;&gt;</span>
                                </div>
                            )}

                            {filteredDestinations.length === 0 ? (
                                <div className="text-center text-muted-foreground p-6">
                                    <Info className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 opacity-30" />
                                    <p className="text-lg md:text-xl font-bold text-foreground">No matches found</p>
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
                                            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing will-change-transform"
                                            style={{ touchAction: 'pan-y' }}
                                        >
                                            <img
                                                src={filteredDestinations[currentIndex].image}
                                                alt={filteredDestinations[currentIndex].name}
                                                className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                                                draggable="false"
                                            />

                                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent pointer-events-none" />

                                            {/* Standalone Info Button (Hidden when panel opens) */}
                                            <AnimatePresence>
                                                {!showTrivia && (
                                                    <motion.button
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ duration: 0.2 }}
                                                        onClick={toggleTrivia}
                                                        className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 md:p-3 bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-full shadow-lg z-30 transition-colors pointer-events-auto cursor-pointer"
                                                    >
                                                        <Info size={20} className="md:w-6 md:h-6" />
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>

                                            {/* Transparent Greenish Box sliding from Right to Left (Made highly transparent) */}
                                            <AnimatePresence>
                                                {showTrivia && (
                                                    <motion.div
                                                        ref={triviaRef}
                                                        initial={{ x: "100%" }}
                                                        animate={{ x: 0 }}
                                                        exit={{ x: "100%" }}
                                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        className="absolute top-0 right-0 bottom-0 w-[75%] md:w-[45%] lg:w-[35%] bg-emerald-950/35 backdrop-blur-md border-l border-emerald-400/20 z-40 shadow-2xl flex flex-col p-6 pointer-events-auto"
                                                    >
                                                        {/* 'i' button acting as close, styled to match the lighter glass theme */}
                                                        <div className="relative w-full">
                                                            <button
                                                                onClick={toggleTrivia}
                                                                className="absolute -top-2 -left-2 md:-top-1 md:-left-1 p-2.5 md:p-3 bg-emerald-800/40 hover:bg-emerald-700/60 backdrop-blur-md border border-emerald-400/30 text-white rounded-full shadow-xl transition-colors cursor-pointer"
                                                            >
                                                                <Info size={20} className="md:w-6 md:h-6" />
                                                            </button>
                                                        </div>

                                                        <div className="mt-14 flex flex-col text-emerald-50">
                                                            <h3 className="font-serif text-xl md:text-2xl font-bold border-b border-emerald-400/30 pb-3 mb-4 drop-shadow-md">Did You Know?</h3>
                                                            <p className="text-sm md:text-base leading-relaxed font-medium drop-shadow-sm">
                                                                {filteredDestinations[currentIndex].trivia}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Content Area */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 pointer-events-none flex flex-col justify-end">

                                                <span className="inline-block bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-white/30 w-fit mb-3">
                                                    {filteredDestinations[currentIndex].vibe}
                                                </span>

                                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-md pr-12">
                                                    {filteredDestinations[currentIndex].name}
                                                </h2>

                                                {/* Stats Row */}
                                                <div className="flex flex-wrap gap-2 md:gap-4 border-t border-white/20 pt-4 md:pt-6">
                                                    <div className="flex items-center gap-1.5 text-white/90 bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/10 text-xs md:text-sm backdrop-blur-sm">
                                                        <Mountain className="h-4 w-4 text-emerald-400" />
                                                        <span>{filteredDestinations[currentIndex].altitude}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-white/90 bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/10 text-xs md:text-sm backdrop-blur-sm">
                                                        <Calendar className="h-4 w-4 text-emerald-400" />
                                                        <span>{filteredDestinations[currentIndex].bestTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-white/90 bg-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/10 text-xs md:text-sm backdrop-blur-sm">
                                                        <CloudSun className="h-4 w-4 text-emerald-400" />
                                                        <span>{filteredDestinations[currentIndex].weather}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Glossy Forward/Backward Buttons - HIDDEN ON MOBILE */}
                                    {currentIndex > 0 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
                                        >
                                            <ChevronLeft className="w-8 h-8" />
                                        </button>
                                    )}

                                    {currentIndex < filteredDestinations.length - 1 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
                                        >
                                            <ChevronRight className="w-8 h-8" />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Minimal Progress Dots */}
                {!loading && filteredDestinations.length > 0 && (
                    <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6 mb-2">
                        {filteredDestinations.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 md:w-8 bg-[#2A5244]' : 'w-1.5 md:w-2 bg-border hover:bg-border/80'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}