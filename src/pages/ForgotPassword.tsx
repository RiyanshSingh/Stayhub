import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


const ForgotPassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Email, 2: Security Question, 3: New Password
    const [email, setEmail] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isBackupCodeMode, setIsBackupCodeMode] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/auth/forgot-password-init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to find account');

            setSecurityQuestion(data.security_question);
            setStep(2);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isBackupCodeMode ? '/api/auth/verify-backup-code' : '/api/auth/verify-security-answer';
            const body = isBackupCodeMode
                ? { email, code: securityAnswer } // Reusing securityAnswer state for code input
                : { email, answer: securityAnswer };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Verification failed');

            setResetToken(data.resetToken);
            setStep(3);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: isBackupCodeMode ? "Invalid or used backup code." : "Incorrect answer. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword, resetToken }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to reset password');

            toast({
                title: "Success",
                description: "Password has been reset successfully. Please sign in.",
            });
            navigate("/signin");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
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
                                    {step === 1 && "Reset Password"}
                                    {step === 2 && "Security Check"}
                                    {step === 3 && "New Password"}
                                </h1>
                                <p className="text-muted-foreground">
                                    {step === 1 && "Enter your email to verify your identity"}
                                    {step === 2 && "Answer your security question"}
                                    {step === 3 && "Create a new strong password"}
                                </p>
                            </div>

                            {step === 1 && (
                                <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                                    <Button type="submit" size="lg" className="w-full text-base" disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                                    </Button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleAnswerSubmit} className="space-y-6">
                                    {!isBackupCodeMode ? (
                                        <div className="bg-muted p-4 rounded-lg mb-4">
                                            <p className="text-sm font-medium text-muted-foreground">Security Question:</p>
                                            <p className="text-lg font-semibold">{securityQuestion}</p>
                                        </div>
                                    ) : (
                                        <div className="bg-muted p-4 rounded-lg mb-4">
                                            <p className="text-sm font-medium text-muted-foreground">Backup Verification</p>
                                            <p className="text-sm">Enter one of your 8-character backup codes.</p>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="securityAnswer">{isBackupCodeMode ? "Backup Code" : "Your Answer"}</Label>
                                        <Input
                                            id="securityAnswer"
                                            type="text"
                                            placeholder={isBackupCodeMode ? "XXXXXXXX" : "Enter your answer"}
                                            value={securityAnswer}
                                            onChange={(e) => setSecurityAnswer(e.target.value)}
                                            required
                                            className={isBackupCodeMode ? "font-mono uppercase tracking-widest" : ""}
                                        />
                                    </div>

                                    <Button type="submit" size="lg" className="w-full text-base" disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isBackupCodeMode ? "Verify Code" : "Verify Answer")}
                                    </Button>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsBackupCodeMode(!isBackupCodeMode);
                                                setSecurityAnswer(""); // Clear input on switch
                                            }}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {isBackupCodeMode ? "Use Security Question instead" : "Try another way (Backup Code)"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <form onSubmit={handlePasswordReset} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" size="lg" className="w-full text-base" disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
                                    </Button>
                                </form>
                            )}

                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                <Link to="/signin" className="flex items-center justify-center gap-2 text-primary font-medium hover:underline">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ForgotPassword;
