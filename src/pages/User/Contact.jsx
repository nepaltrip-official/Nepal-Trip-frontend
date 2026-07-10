import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin, Send, Loader2, Plus, Trash2, RotateCcw, AlertTriangle, X } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { InlineEditor } from "../../components/admin/InlineEditor";
import CustomSelect from "../../components/ui/CustomSelect";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence for smooth exits
import api from "../../api/axios";

// --- Default Configuration ---
const defaultSettings = {
    page_tagline: "Say hello",
    page_title: "Let's plan your journey",
    page_subtitle: "Tell us a bit about the trip you have in mind and we'll get back within one business day.",
    contact_email: "info@nepaltrip.in",
    contact_phone: "+977-1-4000000",
    contact_address: "Thamel, Kathmandu, Nepal",
    formFields: [
        { _id: "f1", label: "Name", type: "text", required: true, options: "" },
        { _id: "f2", label: "Email", type: "email", required: true, options: "" },
        { _id: "f3", label: "Mobile No.", type: "tel", required: true, options: "" },
        { _id: "f4", label: "Gender", type: "radio", required: false, options: "Male,Female,Other" },
        { _id: "f5", label: "Preferred Travel Season", type: "checkbox", required: false, options: "Spring,Summer,Autumn,Winter" },
        { _id: "f6", label: "Message", type: "textarea", required: true, options: "" }
    ]
};

// Options specifically mapped for the Admin's "Add Field" CustomSelect
const fieldTypeOptions = [
    { value: "text", label: "Short Text (String)" },
    { value: "number", label: "Number" },
    { value: "email", label: "Email" },
    { value: "tel", label: "Phone Number" },
    { value: "textarea", label: "Long Text (Textarea)" },
    { value: "radio", label: "Radio Buttons (Single Choice Pill)" },
    { value: "checkbox", label: "Checkboxes (Multiple Choice Pill)" },
    { value: "select", label: "Dropdown Menu (Custom Select)" }
];

export default function Contact() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const isSuperAdmin = isAuthenticated && user?.role === "SuperAdmin";

    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [settings, setSettings] = useState(defaultSettings);

    // Modal States
    const [showResetModal, setShowResetModal] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    // Add Field Modal State
    const [showAddFieldModal, setShowAddFieldModal] = useState(false);
    const [newField, setNewField] = useState({ label: "", type: "text", required: false, options: "" });
    const [optionInput, setOptionInput] = useState("");

    useEffect(() => {
        document.title = "Contact — NepalTrip";
        const timer = setTimeout(() => setIsMounted(true), 50);

        const fetchContactContent = async () => {
            try {
                const { data } = await api.get("/content/contact");
                if (data) setSettings(prev => ({ ...prev, ...data }));
            } catch (error) {
                console.error("Contact page fetch failure:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContactContent();
        return () => clearTimeout(timer);
    }, []);

    const handleCMSFieldSave = async (fieldKey, updatedValue) => {
        setSettings(prev => ({ ...prev, [fieldKey]: updatedValue }));
        try {
            await api.put("/content/contact", { [fieldKey]: updatedValue });
        } catch (error) {
            console.error(`Failed to save ${fieldKey}`);
        }
    };

    const renderEditableText = (fieldKey, type = "text") => {
        const displayValue = settings[fieldKey] || defaultSettings[fieldKey] || "";
        return <InlineEditor type={type} value={displayValue} onSave={(val) => handleCMSFieldSave(fieldKey, val)} />;
    };

    // --- Form Builder Handlers ---
    const updateFormFields = async (newArray) => {
        setSettings(prev => ({ ...prev, formFields: newArray }));
        await handleCMSFieldSave("formFields", newArray);
    };

    const handleAddFormField = () => {
        if (!newField.label.trim()) return toast.error("Field label is required.");
        if (['radio', 'checkbox', 'select'].includes(newField.type) && !newField.options) {
            return toast.error("Please add at least one option for this field type.");
        }

        updateFormFields([...settings.formFields, { ...newField, _id: Date.now().toString() }]);
        setShowAddFieldModal(false);
        setNewField({ label: "", type: "text", required: false, options: "" });
        setOptionInput("");
    };

    const handleDeleteFormField = (index) => {
        updateFormFields(settings.formFields.filter((_, i) => i !== index));
    };

    // --- Option Builder Helpers ---
    const handleAddOption = (e) => {
        e.preventDefault();
        const trimmed = optionInput.trim();
        if (!trimmed) return;

        const currentOptions = newField.options ? newField.options.split(',').map(o => o.trim()) : [];
        if (currentOptions.includes(trimmed)) {
            return toast.warning("Option already exists.");
        }

        currentOptions.push(trimmed);
        setNewField({ ...newField, options: currentOptions.join(',') });
        setOptionInput("");
    };

    const handleRemoveOption = (optionToRemove) => {
        const currentOptions = newField.options.split(',').map(o => o.trim());
        const filteredOptions = currentOptions.filter(opt => opt !== optionToRemove);
        setNewField({ ...newField, options: filteredOptions.join(',') });
    };

    // --- Form Submission Handler ---
    const onSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = Object.fromEntries(fd);

        settings.formFields.filter(f => f.type === 'checkbox').forEach(field => {
            data[field.label] = fd.getAll(field.label);
        });

        setSubmitting(true);
        try {
            await api.post("/inquiries", { formData: data });
            toast.success("Message sent! We'll be in touch soon.");
            e.target.reset();
        } catch (error) {
            toast.error("Could not send message. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRestoreDefaults = async () => {
        setIsResetting(true);
        try {
            await api.put("/content/contact", defaultSettings);
            setSettings(defaultSettings);
            toast.success("Contact page restored successfully!");
            setShowResetModal(false);
        } catch (error) {
            toast.error("Failed to restore default data.");
        } finally {
            setIsResetting(false);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className={`w-full transition-all duration-1000 ease-out transform ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="w-full bg-background min-h-[calc(100dvh-4rem)] py-12 md:py-20 font-sans relative">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-16">
                        <p className="font-serif text-xs uppercase tracking-widest text-primary mb-3 font-bold">
                            {renderEditableText("page_tagline")}
                        </p>
                        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-foreground">
                            {renderEditableText("page_title")}
                        </h1>
                        <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                            {renderEditableText("page_subtitle", "textarea")}
                        </p>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-12 items-start">
                        {/* Contact Details Card */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-serif text-2xl font-bold mb-6 text-foreground">Contact Details</h3>
                                <div className="space-y-6">
                                    <a href={`mailto:${settings.contact_email}`} className="flex gap-4 group">
                                        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Email Us</p>
                                            <p className="text-foreground font-medium">{renderEditableText("contact_email")}</p>
                                        </div>
                                    </a>
                                    <a href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`} className="flex gap-4 group">
                                        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Call Us</p>
                                            <p className="text-foreground font-medium">{renderEditableText("contact_phone")}</p>
                                        </div>
                                    </a>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.contact_address)}`} target="_blank" rel="noopener noreferrer" className="flex gap-4 group">
                                        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Our Office</p>
                                            <p className="text-foreground font-medium">{renderEditableText("contact_address")}</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Form Builder */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            onSubmit={onSubmit}
                            className="lg:col-span-7 space-y-6 bg-card p-8 md:p-10 rounded-3xl border border-border/50 shadow-xl"
                        >
                            {settings.formFields.map((field, idx) => (
                                <div key={field._id || idx} className="relative group grid gap-2">
                                    {isSuperAdmin && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteFormField(idx)}
                                            className="absolute -top-3 -right-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-background shadow-md border border-border/50 p-1.5 rounded-full hover:scale-110"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}

                                    <Label className="font-bold flex items-center gap-1 text-foreground/90 mb-1">
                                        {field.label} {field.required && <span className="text-primary">*</span>}
                                    </Label>

                                    {/* Themed Input Rendering */}
                                    {field.type === "textarea" ? (
                                        <Textarea
                                            name={field.label}
                                            required={field.required}
                                            rows={4}
                                            className="resize-none rounded-xl transition-all duration-200 border-input hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:outline-hidden"
                                            placeholder={`Enter your ${field.label.toLowerCase()}...`}
                                        />

                                    ) : field.type === "select" ? (
                                        <CustomSelect
                                            name={field.label}
                                            options={field.options}
                                            required={field.required}
                                            placeholder={`Select your ${field.label.toLowerCase()}...`}
                                        />

                                    ) : (field.type === "radio" || field.type === "checkbox") ? (
                                        <div className="flex flex-wrap gap-3">
                                            {field.options.split(',').filter(Boolean).map((opt, i) => (
                                                <label key={i} className="cursor-pointer group/pill select-none">
                                                    <input
                                                        type={field.type}
                                                        name={field.label}
                                                        value={opt.trim()}
                                                        required={field.type === "radio" ? field.required : false}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="px-5 py-2 rounded-full border border-border/60 bg-background text-sm font-medium text-muted-foreground transition-all duration-200 
                                                        peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary peer-checked:shadow-md 
                                                        hover:border-primary/50 flex items-center gap-2"
                                                    >
                                                        {opt.trim()}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                    ) : (
                                        <Input
                                            type={field.type}
                                            name={field.label}
                                            required={field.required}
                                            className="h-12 rounded-xl transition-all duration-200 border-input hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:outline-hidden"
                                            placeholder={`Your ${field.label}...`}
                                        />
                                    )}
                                </div>
                            ))}

                            {isSuperAdmin && (
                                <div
                                    onClick={() => setShowAddFieldModal(true)}
                                    className="rounded-xl border-2 border-dashed border-border/60 bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-colors p-6 mt-2"
                                >
                                    <Plus className="h-6 w-6 text-primary mb-2" />
                                    <span className="text-sm font-bold text-primary tracking-wide">Add Custom Field</span>
                                </div>
                            )}

                            <Button type="submit" disabled={submitting} className="w-full h-14 rounded-xl text-lg font-bold shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center gap-2 mt-4 bg-primary text-white hover:bg-primary/90">
                                {submitting ? <><Loader2 className="animate-spin" /> Sending...</> : <><Send size={18} /> Send message</>}
                            </Button>
                        </motion.form>
                    </div>
                </div>

                {/* --- SuperAdmin Modals --- */}
                {isSuperAdmin && (
                    <>
                        <div className="fixed bottom-6 right-6 z-50">
                            <Button onClick={() => setShowResetModal(true)} variant="destructive" className="shadow-2xl font-bold rounded-full px-6 flex items-center gap-2">
                                <RotateCcw className="h-4 w-4" /> Reset Layout
                            </Button>
                        </div>

                        {/* Smooth Modals using AnimatePresence & Framer Motion */}
                        <AnimatePresence>
                            {showAddFieldModal && (
                                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="bg-card border border-border/50 rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
                                    >
                                        <h3 className="font-serif text-2xl font-bold mb-6 text-foreground">Build Form Field</h3>

                                        <div className="space-y-5 relative z-20">
                                            <div>
                                                <Label className="text-muted-foreground font-bold">Field Label / Name</Label>
                                                <Input
                                                    placeholder="e.g. Number of Travelers"
                                                    value={newField.label}
                                                    onChange={e => setNewField({ ...newField, label: e.target.value })}
                                                    className="mt-1 h-11 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                                                />
                                            </div>

                                            <div className="relative z-30">
                                                <Label className="text-muted-foreground font-bold mb-1 block">Input Type</Label>
                                                <CustomSelect
                                                    value={newField.type}
                                                    onChange={e => {
                                                        setNewField({ ...newField, type: e.target.value, options: "" });
                                                        setOptionInput("");
                                                    }}
                                                    options={fieldTypeOptions}
                                                />
                                            </div>

                                            {['radio', 'checkbox', 'select'].includes(newField.type) && (
                                                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-3 relative z-10">
                                                    <Label className="text-primary font-bold">Configure Options</Label>

                                                    <div className="flex flex-wrap gap-2 min-h-8">
                                                        {newField.options ? newField.options.split(',').filter(Boolean).map((opt, i) => (
                                                            <span key={i} className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                                                {opt.trim()}
                                                                <X size={12} className="cursor-pointer hover:scale-125 transition-transform" onClick={() => handleRemoveOption(opt.trim())} />
                                                            </span>
                                                        )) : <span className="text-xs text-muted-foreground italic">No options added yet...</span>}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Type option and press Enter"
                                                            value={optionInput}
                                                            onChange={e => setOptionInput(e.target.value)}
                                                            onKeyDown={e => e.key === 'Enter' && handleAddOption(e)}
                                                            className="h-10 text-sm border-primary/30 focus-visible:ring-primary focus-visible:border-primary rounded-lg"
                                                        />
                                                        <Button type="button" onClick={handleAddOption} className="bg-primary/20 text-primary hover:bg-primary hover:text-white font-bold h-10 px-4 transition-colors rounded-lg">
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={newField.required}
                                                    onChange={e => setNewField({ ...newField, required: e.target.checked })}
                                                    className="accent-primary w-5 h-5 rounded"
                                                />
                                                <span className="text-sm font-bold text-foreground">Make this field mandatory</span>
                                            </label>
                                        </div>

                                        <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-border/50">
                                            <Button variant="ghost" onClick={() => setShowAddFieldModal(false)} className="rounded-xl font-bold">Cancel</Button>
                                            <Button onClick={handleAddFormField} className="bg-primary text-white hover:bg-primary/90 rounded-xl font-bold px-6 shadow-md">Create Field</Button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {showResetModal && (
                                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="bg-card border border-border/50 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center"
                                    >
                                        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                            <AlertTriangle className="h-8 w-8 text-red-500" />
                                        </div>
                                        <h3 className="font-serif text-2xl font-bold mb-2">Restore Default Layout?</h3>
                                        <p className="text-muted-foreground text-sm mb-6">This overwrites the live database with placeholder content and form fields.</p>
                                        <div className="flex gap-3 justify-center">
                                            <Button variant="outline" onClick={() => setShowResetModal(false)} disabled={isResetting} className="w-full font-bold rounded-xl">Cancel</Button>
                                            <Button onClick={handleRestoreDefaults} disabled={isResetting} className="bg-red-500 hover:bg-red-600 text-white w-full font-bold rounded-xl">
                                                {isResetting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Yes, Restore"}
                                            </Button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}