import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Mail, Lock, ArrowRight, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                toast({
                    title: "Welcome back!",
                    description: "You have successfully signed in.",
                });
            } else {
                await register(name, email, password);
                toast({
                    title: "Account created!",
                    description: "You have successfully registered and signed in.",
                });
            }
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: isLogin ? "Login failed" : "Registration failed",
                description: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        // Clear errors or reset specific fields if needed
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-32 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                    >
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                            <div className="text-center mb-8">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold mb-2">
                                    {isLogin ? "Welcome Back" : "Create Account"}
                                </h1>
                                <p className="text-muted-foreground">
                                    {isLogin ? "Sign in to access your account" : "Enter your details to get started"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                className="pl-10"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required={!isLogin}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        {isLogin && (
                                            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" size="lg" className="w-full text-base" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {isLogin ? "Signing in..." : "Creating account..."}
                                        </>
                                    ) : (
                                        <>
                                            {isLogin ? "Sign In" : "Create Account"}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={toggleMode}
                                    className="text-primary font-medium hover:underline focus:outline-none"
                                >
                                    {isLogin ? "Sign up" : "Sign in"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SignIn;
