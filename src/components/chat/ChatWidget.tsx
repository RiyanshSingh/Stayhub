import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface Message {
    role: 'user' | 'model';
    text: string;
}

const ChatWidget = () => {
    const { token, login, user } = useAuth();
    const { toast } = useToast();

    // UI State
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hi! I'm StayHub AI. Need help finding a hotel or checking your bookings?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Mini Login Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial greeting update based on user
    useEffect(() => {
        if (user && messages.length === 1 && messages[0].text.includes("StayHub AI")) {
            setMessages([{ role: 'model', text: `Hi ${user.name}! How can I help you today?` }]);
        }
    }, [user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // backend expects 'history' array and 'message'
            const historyForBackend = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const response = await fetch('http://localhost:5001/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: historyForBackend
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'model', text: data.response || "Sorry, I couldn't understand that." }]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the server. Please check if the backend is running." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMiniLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await login(email, password);
            toast({ title: "Logged In!", description: "You can now continue chatting." });
            setMessages(prev => [...prev, { role: 'model', text: `Welcome back! I can now see your bookings and profile.` }]);
            setEmail(""); setPassword("");
        } catch (err) {
            toast({ variant: "destructive", title: "Login Failed", description: "Invalid credentials." });
        } finally {
            setFormLoading(false);
        }
    };

    const renderMessageContent = (text: string) => {
        // Check for specific tags
        if (text.includes("[SHOW_LOGIN_FORM]")) {
            if (user) return <p>You are already logged in as {user.name}.</p>;

            return (
                <div className="bg-background/50 p-4 rounded-lg border border-border mt-2 space-y-3">
                    <p className="text-sm font-medium">Please sign in to continue:</p>
                    <form onSubmit={handleMiniLogin} className="space-y-2">
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="h-8 text-sm bg-background"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="h-8 text-sm bg-background"
                        />
                        <Button type="submit" size="sm" className="w-full h-8" disabled={formLoading}>
                            {formLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Sign In"}
                        </Button>
                    </form>
                </div>
            );
        }

        // Default Rendering
        return (
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        );
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-card border border-border rounded-2xl shadow-2xl w-[350px] md:w-[400px] h-[500px] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
                    {/* Header */}
                    <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <div>
                                <h3 className="font-semibold">StayHub Assistant</h3>
                                <p className="text-xs opacity-80">{user ? user.name : 'Powered by Gemini 2.5'}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/20" onClick={() => setIsOpen(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4 bg-muted/30">
                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                        msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                                    )}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5 text-primary" />}
                                    </div>
                                    <div className={cn(
                                        "rounded-2xl p-3 max-w-[85%] text-sm shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-card border border-border rounded-tl-none"
                                    )}>
                                        {msg.role === 'model' ? renderMessageContent(msg.text) : msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 shadow-sm">
                                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 bg-card border-t border-border">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                                className="rounded-full"
                            />
                            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="rounded-full shrink-0">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Float Button */}
            {!isOpen && (
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="w-7 h-7" />
                </Button>
            )}
        </div>
    );
};

export default ChatWidget;
