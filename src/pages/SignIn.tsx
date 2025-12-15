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
    const { login, register, loginWithGoogle } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");

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
                await register(name, email, password, securityQuestion, securityAnswer);
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
    };

    // Backup Codes State
    const [showBackupModal, setShowBackupModal] = useState(false);
    const [backupCodes, setBackupCodes] = useState<string[]>([]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(backupCodes.join("\n"));
        toast({ title: "Copied!", description: "Backup codes copied to clipboard." });
    };

    const closeBackupModal = () => {
        setShowBackupModal(false);
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
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
                                <div className="space-y-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={async () => {
                                            setLoading(true);
                                            try {
                                                await loginWithGoogle();
                                                navigate(location.state?.from?.pathname || "/");
                                            } catch (e) {
                                                toast({ variant: "destructive", title: "Login Failed", description: "Could not login with Google" });
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Continue with Google
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                                        </div>
                                    </div>
                                </div>
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

                                {!isLogin && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="securityQuestion">Security Question</Label>
                                            <select
                                                id="securityQuestion"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={securityQuestion}
                                                onChange={(e) => setSecurityQuestion(e.target.value)}
                                                required={!isLogin}
                                            >
                                                <option value="" disabled>Select a question</option>
                                                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                                                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                                                <option value="What city were you born in?">What city were you born in?</option>
                                                <option value="What is your favorite book?">What is your favorite book?</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="securityAnswer">Answer</Label>
                                            <Input
                                                id="securityAnswer"
                                                type="text"
                                                placeholder="Your answer"
                                                value={securityAnswer}
                                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                                required={!isLogin}
                                            />
                                        </div>
                                    </>
                                )}

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

            {showBackupModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card w-full max-w-md rounded-2xl shadow-2xl p-6 border border-border"
                    >
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">Save Your Backup Codes</h2>
                            <p className="text-sm text-muted-foreground">
                                Copy these codes to a safe place. You can use them to recover your account if you lose access to your password or security question.
                            </p>
                        </div>

                        <div className="bg-muted p-4 rounded-xl mb-6 font-mono text-center tracking-widest space-y-2">
                            {backupCodes.map((code) => (
                                <div key={code} className="text-lg font-bold">{code}</div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                                Copy Codes
                            </Button>
                            <Button className="flex-1" onClick={closeBackupModal}>
                                I've Saved Them
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default SignIn;
