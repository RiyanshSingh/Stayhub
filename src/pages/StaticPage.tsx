import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { footerPages } from "@/data/footerData";
import { motion } from "framer-motion";

interface StaticPageProps {
    pageKey?: string;
}

const StaticPage = ({ pageKey }: StaticPageProps) => {
    const location = useLocation();

    // Determine key from prop or path
    const key = pageKey || location.pathname.substring(1); // remove leading slash
    const data = footerPages[key];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    if (!data) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-32 text-center">
                    <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                    <p className="text-muted-foreground">The page you are looking for does not exist.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
                            <p className="text-xl text-muted-foreground">{data.subtitle}</p>
                        </div>

                        <div
                            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary"
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        />
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default StaticPage;
