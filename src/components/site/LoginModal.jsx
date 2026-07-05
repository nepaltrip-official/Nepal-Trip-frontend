import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function LoginModal({ trigger }) {
    const [open, setOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Reset view to Login whenever the modal completely closes
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
            setTimeout(() => setIsLogin(true), 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
                className="fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-120 translate-x-[-50%] translate-y-[-50%] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-border/50 bg-background px-8 py-6 sm:px-10 sm:py-8 shadow-2xl transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
            >
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-5">
                    <img
                        src="/logo.svg"
                        alt="Nepal Trip Logo"
                        className="h-12 w-12 rounded-full object-cover shadow-sm mb-3"
                    />
                    {/* Pinterest Style Typography: Tightly kerned, bold system font */}
                    <h2 className="text-[32px] leading-tight font-bold tracking-[-0.04em] text-foreground font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
                        Welcome to Nepal Trip
                    </h2>
                </div>

                {/* Google Auth Button - Fixed Hover */}
                <Button
                    type="button"
                    className="w-full h-11 rounded-full font-semibold border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm transition-colors duration-200"
                >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </Button>

                {/* Divider */}
                <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center text-xs font-bold">
                        <span className="bg-background px-3 text-muted-foreground">OR</span>
                    </div>
                </div>

                {/* Auth Form */}
                <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>

                    {/* Smooth Accordion for Signup Fields */}
                    <div
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${!isLogin ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                    >
                        <div className="overflow-hidden">
                            <div className="flex flex-col gap-3.5 pb-3.5">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="name" className="text-[13px] font-semibold pl-1">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        className="h-11 rounded-2xl transition-all hover:border-[#FA6D16]/50 focus:border-[#FA6D16] focus-visible:ring-[#FA6D16]/20"
                                    />
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="mobile" className="text-[13px] font-semibold pl-1">Mobile No.</Label>
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        className="h-11 rounded-2xl transition-all hover:border-[#FA6D16]/50 focus:border-[#FA6D16] focus-visible:ring-[#FA6D16]/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Standard Fields (Both Login and Signup) */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="auth-email" className="text-[13px] font-semibold pl-1">Email</Label>
                        <Input
                            id="auth-email"
                            type="email"
                            placeholder="Email address"
                            className="h-11 rounded-2xl transition-all hover:border-[#FA6D16]/50 focus:border-[#FA6D16] focus-visible:ring-[#FA6D16]/20"
                        />
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="auth-password" className="text-[13px] font-semibold pl-1">Password</Label>
                        <div className="relative">
                            <Input
                                id="auth-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="h-11 rounded-2xl pr-10 transition-all hover:border-[#FA6D16]/50 focus:border-[#FA6D16] focus-visible:ring-[#FA6D16]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Smooth Accordion for Forgot Password Link */}
                    <div
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${isLogin ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            }`}
                    >
                        <div className="overflow-hidden">
                            <div className="flex w-full pt-1 pb-2 pl-1">
                                <button
                                    type="button"
                                    className="text-[13px] font-bold text-foreground hover:underline hover:text-[#FA6D16] transition-colors"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-11 mt-2 rounded-full bg-[#FA6D16] text-white font-semibold text-base hover:bg-[#E55B05] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLogin ? "Log in" : "Sign up"}
                    </Button>
                </form>

                {/* Footer Toggle */}
                <div className="mt-6 text-center text-sm">
                    {isLogin ? (
                        <p className="text-muted-foreground">
                            New here?{" "}
                            <button
                                onClick={() => setIsLogin(false)}
                                className="font-bold text-foreground hover:underline hover:text-[#FA6D16] transition-colors"
                            >
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p className="text-muted-foreground">
                            Already a member?{" "}
                            <button
                                onClick={() => setIsLogin(true)}
                                className="font-bold text-foreground hover:underline hover:text-[#FA6D16] transition-colors"
                            >
                                Log in
                            </button>
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}