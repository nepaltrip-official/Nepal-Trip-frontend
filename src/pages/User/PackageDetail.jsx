import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Check, X, Clock, MapPin, ArrowLeft, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { InquiryDialog } from "../../components/site/InquiryDialog";
import { Button } from "../../components/ui/button";
import { resolveImage } from "@/lib/images";

// ----------------------------------------------------------------------
// Sub-component for the expandable itinerary timeline
// ----------------------------------------------------------------------
const ItineraryDay = ({ day, title, details, isFirst, isLast }) => {
    const [isOpen, setIsOpen] = useState(isFirst);

    return (
        <div className={`relative pl-8 md:pl-10 ${!isLast ? "pb-8" : ""}`}>
            {!isLast && <div className="absolute left-2.75 top-6 bottom-0 w-0.5 bg-primary/20" />}

            <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center ring-4 ring-background shadow-sm">
                <span className="text-[10px] text-primary-foreground font-bold">{day}</span>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left flex justify-between items-center group cursor-pointer"
            >
                <h3 className="font-serif text-lg font-semibold group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <div className="p-1 rounded-full bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground transition-colors">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>

            {isOpen && (
                <div className="mt-4 text-muted-foreground leading-relaxed text-sm md:text-base animate-in fade-in slide-in-from-top-2 duration-300">
                    {details}
                </div>
            )}
        </div>
    );
};

// ----------------------------------------------------------------------
// Main Package Detail Component
// ----------------------------------------------------------------------
export default function PackageDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings] = useState({ contact_email: "info@nepaltrip.in" });

    useEffect(() => {
        setTimeout(() => {
            setPkg({
                id: "1",
                title: "Santorini Sunset Honeymoon",
                category: "HONEYMOON",
                destination: "Santorini, Greece",
                duration_days: 6,
                duration_nights: 5,
                price_inr: 175000,
                cover_image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1920&auto=format&fit=crop",
                gallery_images: [
                    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac542?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1469796466635-455efa923389?q=80&w=800&auto=format&fit=crop"
                ],
                description: "Experience the ultimate romantic escape to Oia and Fira. This curated journey offers private caldera views, exclusive wine tasting sessions at sunset, and a luxurious sailing catamaran cruise around the volcanic islands.",
                itinerary: [
                    { day: 1, title: "Arrival in Santorini", details: "Upon arrival at Thira Airport, you will be greeted by your private chauffeur and transferred to your cliffside villa in Oia." },
                    { day: 2, title: "Volcanic Island Cruise", details: "Board a luxury catamaran for a semi-private day cruise. Sail past the Red and White beaches, and swim in the hot springs." }
                ],
                inclusions: ["5 nights in a caldera-view premium villa", "Daily champagne breakfast", "Private airport transfers"],
                exclusions: ["International airfare", "Schengen Visa fees", "Meals not mentioned"]
            });
            setLoading(false);
        }, 600);
    }, [slug]);

    const handleViewGallery = () => {
        navigate(`/gallery?destination=${encodeURIComponent(pkg.destination)}`);
    };

    if (loading) return (
        <div className="flex min-h-[70vh] items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="font-serif text-muted-foreground animate-pulse">Curating your journey...</p>
            </div>
        </div>
    );

    if (!pkg) return (
        <div className="flex min-h-[70vh] items-center justify-center bg-background">
            <div className="text-center">
                <h1 className="font-serif text-4xl text-foreground">Destination not found</h1>
                <Link to="/packages" className="mt-6 inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
                    Browse all packages
                </Link>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-background font-sans pb-20">

            {/* 
              FIXED HERO SECTION: 
              - Removed fixed heights (h-[60vh]) that caused massive spaces on mobile.
              - Changed absolute image z-index from -10 to 0 so it actually shows up above the body background.
              - Used padding-top (pt-32) to account for your navbar.
            */}
            <section className="relative w-full pt-28 pb-12 md:pt-40 md:pb-20 flex flex-col justify-end overflow-hidden">
                <div className="absolute inset-0 z-0 bg-muted">
                    <img
                        src={pkg.cover_image.includes('http') ? pkg.cover_image : resolveImage(pkg.cover_image)}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-black/20" />
                </div>

                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link to="/packages" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-background/50 backdrop-blur-md px-4 py-2 rounded-full w-fit mb-6 shadow-sm border border-border/50">
                        <ArrowLeft className="h-4 w-4" /> Back to explore
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {pkg.category && (
                            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                                {pkg.category}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground bg-background/50 backdrop-blur-md px-3 py-1 rounded-full border border-border/50">
                            <Clock className="h-3.5 w-3.5" /> {pkg.duration_days} Days / {pkg.duration_nights} Nights
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground bg-background/50 backdrop-blur-md px-3 py-1 rounded-full border border-border/50">
                            <MapPin className="h-3.5 w-3.5" /> {pkg.destination}
                        </span>
                    </div>

                    <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold leading-tight text-foreground drop-shadow-sm">
                        {pkg.title}
                    </h1>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">

                    <div className="lg:col-span-2 space-y-12 md:space-y-16">

                        {/* Bento Box Image Grid */}
                        {pkg.gallery_images && pkg.gallery_images.length >= 4 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 md:gap-3 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-lg h-70 sm:h-87.5 md:h-112.5">
                                <div className="col-span-2 row-span-2 relative group overflow-hidden bg-muted">
                                    <img src={pkg.gallery_images[0]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="relative group overflow-hidden bg-muted">
                                    <img src={pkg.gallery_images[1]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="relative group overflow-hidden hidden md:block bg-muted">
                                    <img src={pkg.gallery_images[2]} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div
                                    className="relative cursor-pointer group overflow-hidden col-span-1 md:col-span-2 row-span-1 bg-muted"
                                    onClick={handleViewGallery}
                                >
                                    <img src={pkg.gallery_images[3]} alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center backdrop-blur-[2px]">
                                        <span className="text-white font-semibold flex items-center gap-2 text-xs sm:text-sm md:text-base border border-white/30 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-black/20">
                                            <ImageIcon size={16} /> View photos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Overview */}
                        {pkg.description && (
                            <div>
                                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">About this journey</h2>
                                <p className="leading-relaxed text-muted-foreground text-sm md:text-lg">
                                    {pkg.description}
                                </p>
                            </div>
                        )}

                        {/* Expandable Timeline Itinerary */}
                        {pkg.itinerary?.length > 0 && (
                            <div>
                                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">Day-by-day itinerary</h2>
                                <div className="mt-4 md:mt-6">
                                    {pkg.itinerary.map((d, index) => (
                                        <ItineraryDay
                                            key={d.day}
                                            day={d.day}
                                            title={d.title}
                                            details={d.details}
                                            isFirst={index === 0}
                                            isLast={index === pkg.itinerary.length - 1}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inclusions & Exclusions Cards */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {pkg.inclusions?.length > 0 && (
                                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-3xl p-6">
                                    <h3 className="font-serif text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-400 mb-4 md:mb-6 flex items-center gap-2">
                                        Included
                                    </h3>
                                    <ul className="space-y-3">
                                        {pkg.inclusions.map((item, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm md:text-base text-emerald-800 dark:text-emerald-300/80 leading-snug">
                                                <Check className="shrink-0 h-5 w-5 text-emerald-500" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {pkg.exclusions?.length > 0 && (
                                <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 rounded-3xl p-6">
                                    <h3 className="font-serif text-xl md:text-2xl font-bold text-rose-900 dark:text-rose-400 mb-4 md:mb-6 flex items-center gap-2">
                                        Not Included
                                    </h3>
                                    <ul className="space-y-3">
                                        {pkg.exclusions.map((item, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm md:text-base text-rose-800 dark:text-rose-300/80 leading-snug">
                                                <X className="shrink-0 h-5 w-5 text-rose-500" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Floating Premium Sidebar */}
                    <aside className="lg:sticky lg:top-28 lg:h-fit z-10">
                        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Starting from</p>
                            <div className="mt-2 flex items-baseline gap-1 text-foreground">
                                <span className="font-serif text-4xl md:text-5xl font-bold">₹{Number(pkg.price_inr).toLocaleString("en-IN")}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">per person, taxes extra</p>

                            <div className="mt-6 md:mt-8 space-y-3 relative z-10">
                                <InquiryDialog
                                    packageId={pkg.id}
                                    packageTitle={pkg.title}
                                    trigger={
                                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 md:h-14 rounded-xl text-base md:text-lg font-bold shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]">
                                            Book / Inquire now
                                        </Button>
                                    }
                                />
                            </div>

                            <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-border flex flex-col gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                                <span className="flex items-center gap-2"><Check size={16} className="text-primary" /> Free itinerary tailoring</span>
                                <span className="flex items-center gap-2"><Check size={16} className="text-primary" /> Trusted agency since 2015</span>
                                <span className="flex items-center gap-2"><Check size={16} className="text-primary" /> 24×7 on-trip support</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}