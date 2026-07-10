import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { MapPin, Clock, IndianRupee, Info, Filter, X, ChevronLeft, ChevronRight, LayoutGrid, GalleryHorizontalEnd, Sparkles, Check } from "lucide-react";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Mountains", "Beach", "Nature", "Honeymoon", "Heritage", "Culture"];
const TIERS = ["All", "Gold", "Platinum"];

// --- Premium Style Helpers ---
const getTierBadgeStyle = (tier) => {
    if (tier === 'Gold') return "bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 text-yellow-950 border-amber-300/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]";
    if (tier === 'Platinum') return "bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 text-slate-900 border-slate-400/50 shadow-[0_0_15px_rgba(148,163,184,0.3)]";
    return "bg-slate-200 text-slate-800 border-slate-300";
};

const getTierTextStyle = (tier) => {
    if (tier === 'Gold') return "text-amber-500 drop-shadow-sm font-bold";
    if (tier === 'Platinum') return "text-slate-600 drop-shadow-sm font-bold";
    return "text-foreground font-medium";
};

const getTierIconColor = (tier) => {
    if (tier === 'Gold') return "fill-amber-600 text-amber-600";
    if (tier === 'Platinum') return "fill-slate-600 text-slate-600";
    return "fill-slate-500 text-slate-500";
};

// --- Isolated Skeletons ---
const CardSkeleton = () => (
    <div className="relative w-full h-[calc(100dvh-16rem)] my-4 md:my-0 min-h-100 max-h-200 md:h-[65vh] md:min-h-125 md:max-h-187.5 rounded-[1.5rem] md:rounded-[2rem] bg-muted/30 overflow-hidden flex flex-col justify-end shadow-2xl p-5 md:p-10 border border-border/40 animate-pulse">
        <div className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-muted/60" />
        <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-muted/60" />
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

// --- Continuous 3D Cylinder Card Component ---
const CylinderCard = ({ pkg, index, activeIndex, dragX, navigate, isDragging }) => {
    const PAGE_WIDTH = typeof window !== 'undefined' ? (window.innerWidth < 768 ? window.innerWidth : 800) : 400;

    const localX = useTransform(activeIndex, (latest) => (index - latest) * PAGE_WIDTH);
    const absoluteX = useTransform(
        [dragX, activeIndex],
        ([$drag, $active]) => $drag + (index - $active) * PAGE_WIDTH
    );

    const rotateY = useTransform(absoluteX, [-PAGE_WIDTH, 0, PAGE_WIDTH], [-35, 0, 35]);
    const z = useTransform(absoluteX, [-PAGE_WIDTH, 0, PAGE_WIDTH], [-100, 0, -100]);
    const scale = useTransform(absoluteX, [-PAGE_WIDTH, 0, PAGE_WIDTH], [0.85, 1, 0.85]);
    const opacity = useTransform(absoluteX, [-PAGE_WIDTH, -PAGE_WIDTH / 2, 0, PAGE_WIDTH / 2, PAGE_WIDTH], [0, 0.7, 1, 0.7, 0]);

    return (
        <motion.div
            style={{ x: localX, rotateY, z, scale, opacity, transformStyle: "preserve-3d" }}
            className="absolute inset-0 m-auto w-full h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl bg-black"
            onClick={(e) => {
                if (isDragging.current) { e.preventDefault(); return; }
                navigate(`/packages/${pkg.slug}`);
            }}
        >
            <picture className="absolute inset-0 w-full h-full pointer-events-none">
                <source media="(min-width: 768px)" srcSet={pkg.cover_image_desktop} />
                <img src={pkg.cover_image_mobile} alt={pkg.title} className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105" draggable="false" />
            </picture>

            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 pointer-events-none flex flex-col justify-end transform-gpu">
                <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                    {pkg.serviceTier !== "All" && (
                        <span className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-1.5 border ${getTierBadgeStyle(pkg.serviceTier)}`}>
                            <Sparkles size={14} className={getTierIconColor(pkg.serviceTier)} /> {pkg.serviceTier}
                        </span>
                    )}
                    <span className="bg-black/50 backdrop-blur-sm text-white px-2.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium border border-white/10 flex items-center gap-1.5">
                        <MapPin size={14} /> {pkg.destination}
                    </span>
                </div>

                <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-4 leading-tight drop-shadow-md">
                    {pkg.title}
                </h2>

                <p className="text-white/80 text-sm md:text-lg mb-5 md:mb-8 line-clamp-2 md:line-clamp-3 leading-snug max-w-3xl drop-shadow-sm">
                    {pkg.short_description}
                </p>

                <div className="flex items-center justify-between border-t border-white/20 pt-4 md:pt-6 pointer-events-auto">
                    <div className="flex flex-col">
                        <span className="text-white/60 text-[10px] md:text-sm font-medium uppercase tracking-wider">Starting From</span>
                        <div className="flex items-center text-white font-bold text-xl md:text-3xl drop-shadow-sm mt-0.5">
                            <IndianRupee size={24} className="mr-0.5 md:mr-1" strokeWidth={2.5} />
                            {pkg.price_inr.toLocaleString('en-IN')}
                        </div>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/packages/${pkg.slug}`); }}
                        className="cursor-pointer bg-[#2A5244] hover:bg-[#214136] text-white px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl font-semibold text-sm md:text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl pointer-events-auto"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default function Packages() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [packages, setPackages] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedTier, setSelectedTier] = useState("All");
    const [viewMode, setViewMode] = useState("immersive");

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isTierOpen, setIsTierOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasSwiped, setHasSwiped] = useState(false);

    const dragX = useMotionValue(0);
    const activeIndex = useMotionValue(0);

    const filterRef = useRef(null);
    const tierRef = useRef(null);
    const cardContainerRef = useRef(null);
    const wheelTimeout = useRef(null);
    const isDragging = useRef(false);

    useEffect(() => {
        document.title = "Packages — NepalTrip";
        const timer = setTimeout(() => setIsMounted(true), 50);

        setTimeout(() => {
            setPackages([
                {
                    id: "1", slug: "ladakh-adventure", title: "Ladakh Himalayan Adventure",
                    category: "Mountains", serviceTier: "Platinum",
                    destination: "Ladakh, India", duration_days: 7, duration_nights: 6,
                    price_inr: 45000,
                    cover_image_mobile: "https://images.unsplash.com/photo-1626714485857-79774681600c?q=80&w=800&h=1200&auto=format&fit=crop",
                    cover_image_desktop: "https://images.unsplash.com/photo-1626714485857-79774681600c?q=80&w=1600&h=900&auto=format&fit=crop",
                    short_description: "A high-altitude journey through monasteries, deep valleys and turquoise lakes."
                },
                {
                    id: "2", slug: "maldives-escape", title: "Maldives Overwater Escape",
                    category: "Beach", serviceTier: "Platinum",
                    destination: "Maldives", duration_days: 5, duration_nights: 4,
                    price_inr: 120000,
                    cover_image_mobile: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&h=1200&auto=format&fit=crop",
                    cover_image_desktop: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1600&h=900&auto=format&fit=crop",
                    short_description: "Overwater villas, coral reefs and endless turquoise horizons."
                },
                {
                    id: "3", slug: "kerala-backwaters", title: "Kerala Backwaters & Beaches",
                    category: "Nature", serviceTier: "Gold",
                    destination: "Kerala, India", duration_days: 6, duration_nights: 5,
                    price_inr: 32000,
                    cover_image_mobile: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&h=1200&auto=format&fit=crop",
                    cover_image_desktop: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&h=900&auto=format&fit=crop",
                    short_description: "Houseboats, spice hills and the calm rhythm of Gods Own Country."
                }
            ]);
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || pkg.category === selectedCategory;
        const matchesTier = selectedTier === "All" || pkg.serviceTier === selectedTier;
        return matchesSearch && matchesCategory && matchesTier;
    });

    useEffect(() => {
        setCurrentIndex(0);
        animate(dragX, 0, { duration: 0 });
    }, [searchQuery, selectedCategory, selectedTier, viewMode, dragX]);

    useEffect(() => {
        animate(activeIndex, currentIndex, { type: "spring", stiffness: 300, damping: 30 });
    }, [currentIndex, activeIndex]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
            if (tierRef.current && !tierRef.current.contains(event.target)) setIsTierOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
                setIsFilterOpen(false);
                setIsTierOpen(false);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const container = cardContainerRef.current;
        if (!container || viewMode !== "immersive") return;
        const preventBrowserSwipe = (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.preventDefault();
        };
        container.addEventListener("wheel", preventBrowserSwipe, { passive: false });
        return () => container.removeEventListener("wheel", preventBrowserSwipe);
    }, [isLoading, viewMode]);

    const paginate = (newDirection) => {
        if (newDirection === 1 && currentIndex >= filteredPackages.length - 1) return;
        if (newDirection === -1 && currentIndex <= 0) return;
        setHasSwiped(true);
        setCurrentIndex((prev) => prev + newDirection);
    };

    const handleDragEnd = (e, { offset }) => {
        setTimeout(() => { isDragging.current = false; }, 100);
        const PAGE_WIDTH = window.innerWidth < 768 ? window.innerWidth : 800;
        const swipeThreshold = PAGE_WIDTH * 0.2;

        if (offset.x < -swipeThreshold && currentIndex < filteredPackages.length - 1) {
            paginate(1);
        } else if (offset.x > swipeThreshold && currentIndex > 0) {
            paginate(-1);
        }
        animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
    };

    const handleWheel = (e) => {
        if (wheelTimeout.current || viewMode !== "immersive") return;
        const swipeThreshold = 30;
        if (e.deltaX > swipeThreshold) { paginate(1); lockWheel(); }
        else if (e.deltaX < -swipeThreshold) { paginate(-1); lockWheel(); }
    };

    const lockWheel = () => {
        wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 800);
    };

    const handleCardClick = (slug) => {
        navigate(`/packages/${slug}`);
    };

    return (
        <div className={`w-full transition-all duration-1000 ease-out transform ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className={`w-full bg-background min-h-[calc(100dvh-4rem)] flex flex-col pt-2 pb-6 md:pb-4 md:pt-6 font-sans relative animate-in fade-in duration-700 ${viewMode === 'immersive' ? 'overflow-hidden items-center' : ''}`}>

                {viewMode === 'immersive' && (
                    <style>{`@media (max-width: 767px) { footer { display: none !important; } }`}</style>
                )}

                {/* --- TOP NAVIGATION CONTROLS --- */}
                <motion.div
                    animate={{ y: isScrolled && viewMode === 'immersive' ? -100 : 0, opacity: isScrolled && viewMode === 'immersive' ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-full max-w-full md:max-w-5xl px-4 flex justify-between items-center z-50 mb-6 md:mb-6 ${viewMode === 'grid' ? 'mx-auto' : ''}`}
                >
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-foreground drop-shadow-sm tracking-tight">Explore</h1>
                        {isLoading ? (
                            <div className="h-3 md:h-4 w-24 bg-muted animate-pulse rounded-md mt-1.5" />
                        ) : (
                            <p className="text-muted-foreground text-xs md:text-base font-medium">
                                {filteredPackages.length} {filteredPackages.length === 1 ? 'trip' : 'trips'} found
                            </p>
                        )}
                    </div>

                    {/* CHANGED: We moved `relative` up to this parent flex container so dropdowns anchor to the entire button group's boundaries */}
                    <div className="flex items-center gap-2 md:gap-3 relative">

                        {/* Service Tier Dropdown */}
                        <div ref={tierRef}>
                            <motion.button
                                whileTap={{ scale: 0.95 }} // Slightly softer squish for a wider pill button
                                onClick={() => { setIsTierOpen(!isTierOpen); setIsFilterOpen(false); }}
                                className={`cursor-pointer flex items-center gap-1.5 p-2 md:px-4 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-colors border ${selectedTier !== "All"
                                    ? getTierBadgeStyle(selectedTier)
                                    : "bg-card border-border shadow-sm text-foreground hover:bg-muted"
                                    }`}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={isTierOpen ? "close" : "sparkles"}
                                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="flex items-center justify-center"
                                    >
                                        {isTierOpen ? (
                                            <X size={16} className={selectedTier !== "All" ? getTierIconColor(selectedTier) : ""} />
                                        ) : (
                                            <Sparkles size={16} className={selectedTier !== "All" ? getTierIconColor(selectedTier) : ""} />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                                <span className="hidden sm:inline">{selectedTier === "All" ? "Service Tier" : `${selectedTier} Service`}</span>
                            </motion.button>

                            <AnimatePresence>
                                {isTierOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        // Anchors 12px exactly below the button group and hugs the right edge securely
                                        className="absolute top-[calc(100%+12px)] right-0 w-60 bg-card border border-border p-2 rounded-2xl shadow-xl flex flex-col gap-1 z-100 origin-top-right"
                                    >
                                        <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-1">Select Service Level</div>
                                        {TIERS.map(tier => (
                                            <button
                                                key={tier}
                                                onClick={() => { setSelectedTier(tier); setIsTierOpen(false); }}
                                                className={`cursor-pointer flex items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-colors ${selectedTier === tier ? "bg-primary/10" : "hover:bg-muted"
                                                    } ${getTierTextStyle(tier)}`}
                                            >
                                                {tier === "All" ? "All Packages" : `${tier} Service`}
                                                {selectedTier === tier && <Check size={16} className={getTierTextStyle(tier)} />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Filter Dropdown */}
                        <div ref={filterRef}>
                            <motion.button
                                whileTap={{ scale: 0.9 }} // Deep squish for the circular button
                                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsTierOpen(false); }}
                                // Added explicit fixed width/height so it doesn't jitter during the animation
                                className={`cursor-pointer w-9 h-9 md:w-11 md:h-11 border shadow-sm rounded-full transition-colors flex items-center justify-center ${searchQuery || selectedCategory !== "All" ? "bg-primary text-white border-primary" : "bg-card border-border text-foreground hover:bg-muted"
                                    }`}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={isFilterOpen ? "close" : "filter"}
                                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="flex items-center justify-center"
                                    >
                                        {isFilterOpen ? <X size={18} /> : <Filter size={16} />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button>

                            <AnimatePresence>
                                {isFilterOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        // Ensures 16px of padding from left edge on any screen size!
                                        className="absolute top-[calc(100%+12px)] right-0 w-[calc(100vw-32px)] sm:w-[320px] max-w-90 bg-card border border-border p-4 rounded-2xl shadow-xl flex flex-col gap-4 z-100 origin-top-right"
                                    >
                                        <div>
                                            <label className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Search Destination</label>
                                            <Input type="search" placeholder="E.g., Maldives, Kerala..." className="w-full h-10 text-sm rounded-xl focus-visible:ring-primary focus-visible:border-primary cursor-text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Categories</label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setSelectedCategory(cat)}
                                                        className={`cursor-pointer rounded-full px-3 py-1 text-xs md:text-sm font-medium transition-colors ${selectedCategory === cat ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80"
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

                        {/* View Toggles */}
                        <div className="flex bg-muted/50 p-1 rounded-full border border-border/50">
                            <button
                                onClick={() => setViewMode("immersive")}
                                className={`cursor-pointer p-1.5 rounded-full transition-all ${viewMode === "immersive" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <GalleryHorizontalEnd size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`cursor-pointer p-1.5 rounded-full transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* --- CONTENT RENDER AREA --- */}
                {isLoading ? (
                    <div className="w-full max-w-full md:max-w-5xl px-3 md:px-0 mx-auto">
                        {viewMode === 'immersive' ? <CardSkeleton /> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="h-104 bg-muted/30 rounded-3xl animate-pulse" />
                                <div className="h-104 bg-muted/30 rounded-3xl animate-pulse hidden md:block" />
                                <div className="h-104 bg-muted/30 rounded-3xl animate-pulse hidden lg:block" />
                            </div>
                        )}
                    </div>
                ) : filteredPackages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6">
                        <Info className="w-12 h-12 md:w-16 md:h-16 mb-3 opacity-30" />
                        <p className="text-lg md:text-xl font-bold text-foreground">No packages found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or service tier.</p>
                    </div>
                ) : (
                    <>
                        {viewMode === "immersive" && (
                            <div className="flex-1 w-full max-w-full md:max-w-5xl relative z-10 px-3 md:px-0 mx-auto">
                                <div
                                    ref={cardContainerRef}
                                    onWheel={handleWheel}
                                    style={{ perspective: "1000px" }}
                                    // CHANGED: Adjusted calc() and added my-4 to give bottom and top clearance
                                    className="relative w-full h-[calc(100dvh-16rem)] my-4 md:my-0 min-h-100 max-h-200 md:h-[65vh] md:min-h-125 md:max-h-187.5 overflow-hidden flex items-center justify-center overscroll-x-none"
                                >
                                    {!hasSwiped && filteredPackages.length > 1 && (
                                        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none md:hidden z-30 text-white/80 font-black text-2xl tracking-widest drop-shadow-md">
                                            <span className="animate-pulse">&lt;&lt;&lt;</span>
                                            <span className="animate-pulse">&gt;&gt;&gt;</span>
                                        </div>
                                    )}

                                    <motion.div
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={1}
                                        style={{ x: dragX, transformStyle: "preserve-3d" }}
                                        onDragStart={() => { isDragging.current = true; setHasSwiped(true); }}
                                        onDragEnd={handleDragEnd}
                                        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing flex items-center justify-center"
                                    >
                                        {filteredPackages.map((pkg, i) => (
                                            <CylinderCard
                                                key={pkg.id}
                                                pkg={pkg}
                                                index={i}
                                                activeIndex={activeIndex}
                                                dragX={dragX}
                                                navigate={navigate}
                                                isDragging={isDragging}
                                            />
                                        ))}
                                    </motion.div>

                                    {currentIndex > 0 && (
                                        <button onClick={(e) => { e.stopPropagation(); paginate(-1); }} className="cursor-pointer hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-white/30 hover:scale-110 active:scale-95">
                                            <ChevronLeft className="w-8 h-8" />
                                        </button>
                                    )}
                                    {currentIndex < filteredPackages.length - 1 && (
                                        <button onClick={(e) => { e.stopPropagation(); paginate(1); }} className="cursor-pointer hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all hover:bg-white/30 hover:scale-110 active:scale-95">
                                            <ChevronRight className="w-8 h-8" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6 mb-2">
                                    {filteredPackages.map((_, idx) => (
                                        <div key={idx} className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 md:w-8 bg-[#2A5244]' : 'w-1.5 md:w-2 bg-border hover:bg-border/80'}`} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {viewMode === "grid" && (
                            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16 md:pb-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                    {filteredPackages.map((pkg, idx) => (
                                        <motion.div
                                            key={pkg.id}
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                                            onClick={() => handleCardClick(pkg.slug)}
                                            className="cursor-pointer group bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                                        >
                                            <div className="relative h-56 w-full overflow-hidden pointer-events-none">
                                                <img src={pkg.cover_image_desktop || pkg.cover_image_mobile} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                                                <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                                                    <span className="bg-background/90 backdrop-blur text-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-border/50">
                                                        {pkg.category}
                                                    </span>
                                                    {pkg.serviceTier !== "All" && (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${getTierBadgeStyle(pkg.serviceTier)}`}>
                                                            <Sparkles size={12} className={getTierIconColor(pkg.serviceTier)} /> {pkg.serviceTier}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-6 flex-1 flex flex-col pointer-events-none">
                                                <div className="flex items-center gap-3 text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">
                                                    <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {pkg.destination}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Clock size={14} className="text-primary" /> {pkg.duration_days}D/{pkg.duration_nights}N</span>
                                                </div>

                                                <h3 className="text-xl font-serif font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {pkg.title}
                                                </h3>

                                                <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                                                    {pkg.short_description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                                                    <div>
                                                        <span className="text-xs text-muted-foreground font-medium uppercase">From</span>
                                                        <div className="text-lg font-bold text-foreground flex items-center">
                                                            <IndianRupee size={16} strokeWidth={2.5} /> {pkg.price_inr.toLocaleString('en-IN')}
                                                        </div>
                                                    </div>
                                                    <div className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        View <ChevronRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}