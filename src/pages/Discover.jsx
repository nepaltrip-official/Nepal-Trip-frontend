import React, { useState, useEffect } from "react";
import { MapPin, Info, Mountain, Calendar, CloudSun } from "lucide-react";

export default function Discover() {
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        document.title = "Discover Nepal — NepalTrip";
    }, []);

    const filters = ["All", "Culture & City", "High Altitude Trekking", "Wildlife & Jungle"];

    const destinations = [
        {
            name: "Kathmandu Valley",
            vibe: "Culture & City",
            image: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?q=80&w=800&auto=format&fit=crop",
            trivia: "Home to 7 UNESCO World Heritage sites within a 15km radius. It's often called the 'living museum' of the world.",
            altitude: "1,400m (4,600 ft)",
            bestTime: "Sept to Nov & Feb to April",
            weather: "Mild days, chilly nights"
        },
        {
            name: "Everest Base Camp",
            vibe: "High Altitude Trekking",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
            trivia: "You lose about 30% of your oxygen capacity at Base Camp. Acclimatization days aren't optional—they are life-saving!",
            altitude: "5,364m (17,598 ft)",
            bestTime: "Pre-monsoon (March-May)",
            weather: "Extremely cold, unpredictable"
        },
        {
            name: "Chitwan National Park",
            vibe: "Wildlife & Jungle",
            image: "https://images.unsplash.com/photo-1585675100414-22d71f11cb23?q=80&w=800&auto=format&fit=crop",
            trivia: "One of the last safe havens for the One-Horned Rhinoceros and the elusive Royal Bengal Tiger.",
            altitude: "150m (490 ft)",
            bestTime: "Oct to March (Dry season)",
            weather: "Tropical, humid & warm"
        },
        {
            name: "Pokhara Lakeside",
            vibe: "Culture & City",
            image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=800&auto=format&fit=crop",
            trivia: "The adventure capital of Nepal. You can paraglide alongside eagles with the Annapurna range as your backdrop.",
            altitude: "822m (2,696 ft)",
            bestTime: "Sept to Nov",
            weather: "Pleasant, high rainfall in monsoon"
        }
    ];

    const filteredDestinations = activeFilter === "All"
        ? destinations
        : destinations.filter(d => d.vibe === activeFilter);

    return (
        <div className="w-full bg-background/50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="mb-12">
                    <p className="font-serif text-sm uppercase tracking-widest text-accent">Know Before You Go</p>
                    <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Discover Your Vibe</h1>
                    <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                        Not all regions are built the same. Filter by the experience you want to see practical info, trivia, and prepare for the journey ahead.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${activeFilter === filter
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-white border text-foreground hover:bg-muted"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Destination Cards */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {filteredDestinations.map((dest, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-md">
                            <div className="sm:w-2/5 h-64 sm:h-auto shrink-0">
                                <img src={dest.image} alt={dest.name} className="h-full w-full object-cover" />
                            </div>

                            <div className="flex flex-col justify-between p-6 sm:w-3/5">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-serif text-2xl text-primary">{dest.name}</h3>
                                    </div>
                                    <span className="mt-2 inline-block rounded-md bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                                        {dest.vibe}
                                    </span>

                                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
                                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <p className="leading-relaxed"><strong>Trivia:</strong> {dest.trivia}</p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-2 text-sm text-muted-foreground border-t border-border/40 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Mountain className="h-4 w-4" /> <span><strong>Altitude:</strong> {dest.altitude}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> <span><strong>Best Time:</strong> {dest.bestTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CloudSun className="h-4 w-4" /> <span><strong>Weather:</strong> {dest.weather}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}