import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer({ settings }) {
    if (!settings) return null;

    return (
        <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8 text-center md:text-left">

                {/* Brand Section */}
                <div className="md:col-span-2 flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground text-primary font-serif text-lg">
                            N
                        </span>
                        <span className="font-serif text-xl">{settings.brand_name}</span>
                    </div>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80">
                        {settings.tagline}
                    </p>
                </div>

                {/* Explore Section */}
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="font-serif text-sm uppercase tracking-widest text-primary-foreground/60">Explore</h4>
                    <ul className="mt-4 flex flex-col items-center md:items-start space-y-3 text-sm">
                        <li><Link to="/" className="transition-colors hover:text-accent">Home</Link></li>
                        <li><Link to="/packages" className="transition-colors hover:text-accent">Packages</Link></li>
                        <li><Link to="/discover" className="transition-colors hover:text-accent">Discover</Link></li> {/* Added Discover */}
                        <li><Link to="/about" className="transition-colors hover:text-accent">About</Link></li>
                        <li><Link to="/gallery" className="transition-colors hover:text-accent">Gallery</Link></li>
                        <li><Link to="/testimonials" className="transition-colors hover:text-accent">Testimonials</Link></li>
                        <li><Link to="/contact" className="transition-colors hover:text-accent">Contact</Link></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="font-serif text-sm uppercase tracking-widest text-primary-foreground/60">Contact</h4>
                    <ul className="mt-4 flex flex-col items-center md:items-start space-y-6 text-sm text-primary-foreground/90">

                        {/* Email */}
                        <li className="flex flex-col items-center md:items-start gap-1.5 group">
                            <div className="flex items-center gap-1.5 text-primary-foreground/60">
                                <Mail className="h-4 w-4 shrink-0 transition-colors group-hover:text-accent" />
                                <span className="text-xs uppercase tracking-wider">Email</span>
                            </div>
                            <a href={`mailto:${settings.contact_email}`} className="transition-colors hover:text-accent">
                                {settings.contact_email || "ankitpandey78600@gmail.com"}
                            </a>
                        </li>

                        {/* Phone */}
                        <li className="flex flex-col items-center md:items-start gap-1.5 group">
                            <div className="flex items-center gap-1.5 text-primary-foreground/60">
                                <Phone className="h-4 w-4 shrink-0 transition-colors group-hover:text-accent" />
                                <span className="text-xs uppercase tracking-wider">Phone</span>
                            </div>
                            <a href={`tel:${settings.contact_phone}`} className="transition-colors hover:text-accent">
                                {settings.contact_phone || "+91 8318538918"}
                            </a>
                        </li>

                        {/* Address */}
                        <li className="flex flex-col items-center md:items-start gap-1.5 group">
                            <div className="flex items-center gap-1.5 text-primary-foreground/60">
                                <MapPin className="h-4 w-4 shrink-0 transition-colors group-hover:text-accent" />
                                <span className="text-xs uppercase tracking-wider">Address</span>
                            </div>
                            <a href="https://www.google.com/maps/search/?api=1&query=721%2F1+Sri+Ram+Nagar+Civil+Line+1+Sultanpur" target="_blank" rel="noopener noreferrer" className="max-w-62.5 leading-relaxed transition-colors hover:text-accent">
                                {settings.contact_address || "721/1 Sri Ram Nagar Civil Line 1 Sultanpur"}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/60">
                © {new Date().getFullYear()} {settings.brand_name}. All rights reserved.
            </div>
        </footer>
    );
}