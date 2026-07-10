import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({
    name,
    options,
    placeholder = "Select an option...",
    required,
    value,      // Added for controlled state
    onChange    // Added for controlled state
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [internalSelected, setInternalSelected] = useState("");
    const dropdownRef = useRef(null);

    // Determine if the component is being controlled by a parent (like the Add Field Modal)
    const isControlled = value !== undefined && onChange !== undefined;
    const currentValue = isControlled ? value : internalSelected;

    // Smart parsing: Handles both comma-separated strings AND arrays of objects
    const parsedOptions = Array.isArray(options)
        ? options
        : (typeof options === 'string'
            ? options.split(',').filter(Boolean).map(o => ({ value: o.trim(), label: o.trim() }))
            : []);

    // Find the label to display based on the current value
    const currentLabel = parsedOptions.find(opt => opt.value === currentValue)?.label || currentValue;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        if (isControlled) {
            // Mimic a standard event object so it works identically to native inputs
            onChange({ target: { name, value: val } });
        } else {
            setInternalSelected(val);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Hidden native input ensures form submissions capture the value */}
            <input type="hidden" name={name} value={currentValue} required={required} />

            {/* Custom Clickable Trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-12 rounded-xl border bg-background px-4 text-sm flex items-center justify-between cursor-pointer transition-all duration-200 ${isOpen
                        ? "border-primary ring-2 ring-primary/20 shadow-sm"
                        : "border-input hover:border-primary/50"
                    } ${!currentValue ? "text-muted-foreground" : "text-foreground font-medium"}`}
            >
                <span className="truncate">{currentLabel || placeholder}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {/* Custom Dropdown List */}
            {isOpen && (
                <ul className="absolute z-50 w-full mt-2 bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
                    {parsedOptions.map((opt, idx) => (
                        <li
                            key={idx}
                            onClick={() => handleSelect(opt.value)}
                            className={`px-4 py-3 text-sm cursor-pointer transition-colors duration-150 ${currentValue === opt.value
                                    ? "bg-primary text-white font-bold"
                                    : "text-foreground hover:bg-primary/10 hover:text-primary font-medium"
                                }`}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}