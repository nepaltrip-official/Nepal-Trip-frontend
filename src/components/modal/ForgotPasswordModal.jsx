import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import api from "../../api/axios";

export function ForgotPasswordView({ onBackToLogin, onSuccess }) {
    const [view, setView] = useState("email_input"); // email_input, otp_verify, reset_password
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [email, setEmail] = useState("");
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const [passwords, setPasswords] = useState({ new: "", confirm: "" });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [otpTimer, setOtpTimer] = useState(0);
    const [resetToken, setResetToken] = useState(null);
    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (otpTimer > 0) interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [otpTimer]);

    useEffect(() => {
        const currentOtp = otpValues.join("");
        if (view === "otp_verify" && currentOtp.length === 6 && !loading) {
            handleVerifyOtp(currentOtp);
        }
    }, [otpValues, view]);

    const resetState = () => {
        setView("email_input");
        setEmail("");
        setOtpValues(["", "", "", "", "", ""]);
        setPasswords({ new: "", confirm: "" });
        setErrors({});
        setOtpTimer(0);
        setResetToken(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]*$/.test(value)) return;
        const newOtp = [...otpValues];
        newOtp[index] = value.substring(value.length - 1);
        setOtpValues(newOtp);
        if (value !== "" && index < 5) inputRefs.current[index + 1].focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
        if (pastedData) {
            const newOtp = [...otpValues];
            for (let i = 0; i < pastedData.length; i++) newOtp[i] = pastedData[i];
            setOtpValues(newOtp);
            inputRefs.current[pastedData.length < 6 ? pastedData.length : 5].focus();
        }
    };

    const handleSendOtp = async (e) => {
        e?.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return setErrors({ email: "Please enter a valid email address." });
        }
        setLoading(true); setErrors({});
        try {
            const { data } = await api.post("/otp/send-otp", { email });
            toast.success(data.message);
            setOtpTimer(60);
            setView("otp_verify");
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } catch (error) {
            setErrors({ general: error.response?.data?.message || "Failed to send OTP" });
        } finally { setLoading(false); }
    };

    const handleVerifyOtp = async (otpString) => {
        setLoading(true); setErrors({});
        try {
            const { data } = await api.post("/otp/verify-otp", { email, otp: otpString });
            toast.success(data.message);
            setResetToken(data.resetToken);
            setView("reset_password");
        } catch (error) {
            setErrors({ general: error.response?.data?.message || "Invalid OTP" });
            setOtpValues(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally { setLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwords.new)) {
            return setErrors({ new: "Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol." });
        }
        if (passwords.new !== passwords.confirm) {
            return setErrors({ confirm: "Passwords do not match." });
        }

        setLoading(true); setErrors({});
        try {
            const { data } = await api.post("/otp/reset-password", { resetToken, newPassword: passwords.new });
            toast.success(data.message);
            resetState();
            if (onSuccess) onSuccess(); // Switch back to login view smoothly
        } catch (error) {
            setErrors({ general: error.response?.data?.message || "Failed to reset password" });
        } finally { setLoading(false); }
    };

    return (
        <div className="w-full pb-2">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6 relative">
                <button
                    onClick={() => {
                        if (view === "email_input" && onBackToLogin) {
                            onBackToLogin();
                        } else {
                            resetState();
                        }
                    }}
                    className="absolute left-0 top-1 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="h-12 w-12 rounded-full bg-[#FA6D16]/10 flex items-center justify-center mb-4">
                    <img src="/logo.svg" alt="Logo" className="h-8 w-8 object-contain" />
                </div>
                <h2 className="text-[24px] font-bold tracking-tight text-foreground">
                    {view === 'email_input' ? 'Reset Password' :
                        view === 'otp_verify' ? 'Check your email' : 'Create New Password'}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 px-2">
                    {view === 'email_input' ? "Enter your registered email and we'll send you an OTP." :
                        view === 'otp_verify' ? `We sent a 6-digit code to ${email}` :
                            "Your new password must be different from previous ones."}
                </p>
            </div>

            {/* Error Banner */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${errors.general ? "max-h-20 mb-4 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex items-center justify-center px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                    {errors.general}
                </div>
            </div>

            {/* EMAIL INPUT */}
            {view === "email_input" && (
                <form onSubmit={handleSendOtp} className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="relative pb-6">
                        <Label htmlFor="reset-email" className="text-[13px] font-semibold pl-1">Email Address</Label>
                        <Input id="reset-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({}); }} placeholder="name@example.com" className={`h-11 rounded-2xl transition-all ${errors.email ? 'border-red-500' : 'hover:border-[#FA6D16]/50 focus:border-[#FA6D16]'}`} />
                        {errors.email && <span className="absolute bottom-1 left-1 text-[11px] text-red-500">{errors.email}</span>}
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-[#FA6D16] text-white font-semibold hover:bg-[#E55B05] transition-all disabled:opacity-80">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send OTP
                    </Button>
                </form>
            )}

            {/* OTP VERIFY */}
            {view === "otp_verify" && (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex gap-2 justify-center mb-6 w-full" onPaste={handleOtpPaste}>
                        {otpValues.map((digit, index) => (
                            <Input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-12 h-14 text-center text-xl font-bold rounded-xl border-input focus:border-[#FA6D16] transition-all p-0"
                            />
                        ))}
                    </div>
                    {loading && (
                        <div className="flex items-center justify-center text-[#FA6D16] text-sm font-semibold mb-4 animate-pulse">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                        </div>
                    )}
                    <div className="text-center text-sm mt-2">
                        <button type="button" onClick={() => handleSendOtp()} disabled={otpTimer > 0 || loading} className="text-[#FA6D16] font-semibold hover:underline disabled:opacity-50 disabled:no-underline">
                            {otpTimer > 0 ? `Resend Code in ${otpTimer}s` : "Resend OTP"}
                        </button>
                    </div>
                </div>
            )}

            {/* RESET PASSWORD */}
            {view === "reset_password" && (
                <form onSubmit={handleResetPassword} className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="relative pb-5">
                        <Label htmlFor="new-password" className="text-[13px] font-semibold pl-1">New Password</Label>
                        <div className="relative">
                            <Input id="new-password" type={showPassword ? "text" : "password"} value={passwords.new} onChange={(e) => { setPasswords({ ...passwords, new: e.target.value }); setErrors({}); }} placeholder="••••••••" className={`h-11 rounded-2xl pr-10 transition-all ${errors.new ? 'border-red-500' : 'hover:border-[#FA6D16]/50 focus:border-[#FA6D16]'}`} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.new && <span className="absolute -bottom-1 left-1 text-[11px] leading-tight text-red-500 whitespace-nowrap">{errors.new}</span>}
                    </div>

                    <div className="relative pb-6">
                        <Label htmlFor="confirm-password" className="text-[13px] font-semibold pl-1">Confirm Password</Label>
                        <div className="relative">
                            <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} value={passwords.confirm} onChange={(e) => { setPasswords({ ...passwords, confirm: e.target.value }); setErrors({}); }} placeholder="••••••••" className={`h-11 rounded-2xl pr-10 transition-all ${errors.confirm ? 'border-red-500' : 'hover:border-[#FA6D16]/50 focus:border-[#FA6D16]'}`} />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.confirm && <span className="absolute bottom-1 left-1 text-[11px] text-red-500">{errors.confirm}</span>}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-[#FA6D16] text-white font-semibold hover:bg-[#E55B05] transition-all disabled:opacity-80">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>
                </form>
            )}
        </div>
    );
}