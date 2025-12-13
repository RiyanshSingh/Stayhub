export interface PageContent {
    title: string;
    subtitle: string;
    content: string;
}

export const footerPages: Record<string, PageContent> = {
    about: {
        title: "About Us",
        subtitle: "Building the future of hospitality",
        content: `
            <h3>Our Mission</h3>
            <p>At StayHub, we believe that travel should be seamless, inspiring, and accessible to everyone. Our mission is to connect travelers with unique stays and experiences around the world, fostering a sense of belonging wherever they go.</p>
            
            <h3>Our Story</h3>
            <p>Founded in 2024, StayHub started as a small project to help friends find authentic local stays. Today, we've grown into a global community of hosts and travelers.</p>
            
            <h3>Our Values</h3>
            <ul>
                <li><strong>Trust & Safety:</strong> We prioritize the safety and security of our community above all else.</li>
                <li><strong>Inclusivity:</strong> We believe in a world where anyone can belong anywhere.</li>
                <li><strong>Innovation:</strong> We're constantly pushing boundaries to improve the travel experience.</li>
            </ul>
        `
    },
    careers: {
        title: "Careers",
        subtitle: "Join our growing team",
        content: `
            <h3>Work at StayHub</h3>
            <p>We're looking for passionate individuals to join our mission. If you love travel, technology, and solving complex problems, we'd love to hear from you.</p>
            
            <h3>Open Positions</h3>
            <div class="space-y-4 my-6">
                <div class="p-4 border rounded-lg">
                    <h4 class="font-bold">Senior Frontend Engineer</h4>
                    <p class="text-sm text-muted-foreground">Remote • Engineering</p>
                </div>
                <div class="p-4 border rounded-lg">
                    <h4 class="font-bold">Product Designer</h4>
                    <p class="text-sm text-muted-foreground">New York • Design</p>
                </div>
                <div class="p-4 border rounded-lg">
                    <h4 class="font-bold">Customer Experience Specialist</h4>
                    <p class="text-sm text-muted-foreground">London • Support</p>
                </div>
            </div>
            
            <p>Don't see a role that fits? Send us your resume at careers@stayhub.com.</p>
        `
    },
    press: {
        title: "Press",
        subtitle: "Latest news and updates",
        content: `
            <h3>In the News</h3>
            <p>Check out what people are saying about StayHub.</p>
            
            <div class="grid gap-6 my-8">
                <div class="border-l-4 border-primary pl-4">
                    <p class="italic text-lg">"StayHub is refining how we book travel in the digital age."</p>
                    <p class="text-sm text-muted-foreground mt-2">- Tech Daily, Nov 2024</p>
                </div>
                <div class="border-l-4 border-primary pl-4">
                    <p class="italic text-lg">"The best platform for finding unique, local stays."</p>
                    <p class="text-sm text-muted-foreground mt-2">- Travel Weekly, Oct 2024</p>
                </div>
            </div>
            
            <h3>Media Inquiries</h3>
            <p>For press releases and media kits, please contact press@stayhub.com.</p>
        `
    },
    blog: {
        title: "Blog",
        subtitle: "Travel tips, stories, and inspiration",
        content: `
            <div class="grid md:grid-cols-2 gap-8">
                <div class="border rounded-xl overflow-hidden">
                    <div class="h-48 bg-muted flex items-center justify-center">Image Placeholder</div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">10 Hidden Gems in Paris</h3>
                        <p class="text-muted-foreground mb-4">Discover the secret spots that locals love...</p>
                        <a href="#" class="text-primary font-medium">Read more</a>
                    </div>
                </div>
                <div class="border rounded-xl overflow-hidden">
                    <div class="h-48 bg-muted flex items-center justify-center">Image Placeholder</div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">The Ultimate Packing Guide</h3>
                        <p class="text-muted-foreground mb-4">Everything you need for a stress-free trip...</p>
                        <a href="#" class="text-primary font-medium">Read more</a>
                    </div>
                </div>
            </div>
        `
    },
    help: {
        title: "Help Center",
        subtitle: "How can we help you?",
        content: `
            <h3>Popular Topics</h3>
            <ul class="list-disc pl-5 space-y-2 mb-6">
                <li><a href="#" class="text-primary hover:underline">How do I cancel my booking?</a></li>
                <li><a href="#" class="text-primary hover:underline">What is the refund policy?</a></li>
                <li><a href="#" class="text-primary hover:underline">How do I contact my host?</a></li>
                <li><a href="#" class="text-primary hover:underline">Payment methods accepted</a></li>
            </ul>
            
            <h3>Still need help?</h3>
            <p>Our support team is available 24/7 to assist you.</p>
        `
    },
    contact: {
        title: "Contact Us",
        subtitle: "Get in touch with our team",
        content: `
            <p class="mb-6">We're here to help! Choose the best way to reach us below.</p>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div class="p-6 bg-secondary/20 rounded-xl">
                    <h3 class="font-bold mb-2">Customer Support</h3>
                    <p class="text-sm text-muted-foreground mb-4">For help with bookings and account issues.</p>
                    <p class="font-medium">support@stayhub.com</p>
                    <p class="font-medium">+1 (555) 123-4567</p>
                </div>
                <div class="p-6 bg-secondary/20 rounded-xl">
                    <h3 class="font-bold mb-2">Business Inquiries</h3>
                    <p class="text-sm text-muted-foreground mb-4">For partnerships and advertising.</p>
                    <p class="font-medium">partners@stayhub.com</p>
                </div>
            </div>
            
            <h3 class="mt-8 mb-4">Office Location</h3>
            <p>123 Innovation Drive<br>Mumbai, Maharashtra 400001<br>India</p>
        `
    },
    cancellation: {
        title: "Cancellation Policy",
        subtitle: "Understanding our policies",
        content: `
            <h3>Flexible Cancellation</h3>
            <p>Guests can cancel until 24 hours before check-in for a full refund based on the property specific policy.</p>
            
            <h3>Moderate Cancellation</h3>
            <p>Guests can cancel until 5 days before check-in for a full refund.</p>
            
            <h3>Strict Cancellation</h3>
            <p>Guests can cancel until 30 days before check-in for a full refund.</p>
            
            <p class="mt-4 text-sm text-muted-foreground">* Specific policies are set by hosts and displayed on the booking page.</p>
        `
    },
    safety: {
        title: "Safety Centre",
        subtitle: "Your safety is our priority",
        content: `
            <h3>Trust & Safety Guidelines</h3>
            <p>We work hard to ensure every stay is safe and secure.</p>
            
            <h4 class="font-bold mt-4">For Guests</h4>
            <ul class="list-disc pl-5 mb-4">
                <li>Read reviews before booking</li>
                <li>Communicate through the StayHub platform</li>
                <li>Review safety amenities (smoke detectors, first aid)</li>
            </ul>
            
            <h4 class="font-bold mt-4">For Hosts</h4>
            <ul class="list-disc pl-5 mb-4">
                <li>Verify your identity</li>
                <li>Set clear house rules</li>
                <li>Install safety devices</li>
            </ul>
            
            <p class="mt-6 font-bold">In an emergency, dial local emergency services immediately.</p>
        `
    },
    "owner/resources": {
        title: "Host Resources",
        subtitle: "Tips and guides for hosting",
        content: `
            <h3>Getting Started</h3>
            <p>Learn the basics of setting up your listing and welcoming your first guests.</p>
            
            <h3>Hosting Tips</h3>
            <ul class="list-disc pl-5 space-y-2 my-4">
                <li>How to take great photos</li>
                <li>Writing a compelling description</li>
                <li>Pricing strategies for success</li>
            </ul>
            
            <h3>Superhost Program</h3>
            <p>Discover the benefits of becoming a Superhost and achieving top-rated status.</p>
        `
    },
    "owner/community": {
        title: "Community Forum",
        subtitle: "Connect with other hosts",
        content: `
            <p>Join thousands of hosts discussing tips, sharing stories, and helping each other succeed.</p>
            
            <div class="my-8 text-center p-12 bg-secondary/20 rounded-xl">
                <h3 class="text-xl font-bold mb-2">Coming Soon</h3>
                <p>We are rebuilding our community forum to better serve you. Stay tuned!</p>
            </div>
        `
    },
    "owner/responsible": {
        title: "Responsible Hosting",
        subtitle: "Hosting with care",
        content: `
            <h3>Be a Good Neighbor</h3>
            <p>Ensure your guests respect local noise ordinances and community rules.</p>
            
            <h3>Safety Regulations</h3>
            <p>Follow local laws regarding fire safety, occupancy limits, and emergency exits.</p>
            
            <h3>Local Laws</h3>
            <p>Understand the regulations and taxes that apply to short-term rentals in your city.</p>
        `
    },
    privacy: {
        title: "Privacy Policy",
        subtitle: "Last updated: December 2024",
        content: `
            <h3>1. Introduction</h3>
            <p>We value your privacy and are committed to protecting your personal data.</p>
            
            <h3>2. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as when you create an account, make a booking, or contact support.</p>
            
            <h3>3. How We Use Your Information</h3>
            <p>We use your information to provide our services, process payments, and improve user experience.</p>
            
            <h3>4. Data Security</h3>
            <p>We implement appropriate technical and organizational measures to safeguard your data.</p>
        `
    },
    terms: {
        title: "Terms of Service",
        subtitle: "Last updated: December 2024",
        content: `
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing or using StayHub, you agree to these Terms of Service.</p>
            
            <h3>2. Use of Platform</h3>
            <p>You agree to use the platform only for lawful purposes and in accordance with these Terms.</p>
            
            <h3>3. Booking & Cancellations</h3>
            <p>Bookings are subject to the specific confirmation and cancellation policies displayed at the time of booking.</p>
            
            <h3>4. Limitation of Liability</h3>
            <p>StayHub is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
        `
    },
    sitemap: {
        title: "Sitemap",
        subtitle: "Navigate our site",
        content: `
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="font-bold mb-2">Main</h3>
                    <ul class="space-y-1">
                        <li><a href="/" class="text-primary hover:underline">Home</a></li>
                        <li><a href="/search" class="text-primary hover:underline">Search</a></li>
                        <li><a href="/signin" class="text-primary hover:underline">Sign In</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold mb-2">Hosting</h3>
                     <ul class="space-y-1">
                        <li><a href="/owner" class="text-primary hover:underline">List Property</a></li>
                        <li><a href="/dashboard" class="text-primary hover:underline">Dashboard</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold mb-2">Support</h3>
                     <ul class="space-y-1">
                        <li><a href="/help" class="text-primary hover:underline">Help Center</a></li>
                        <li><a href="/contact" class="text-primary hover:underline">Contact</a></li>
                    </ul>
                </div>
            </div>
        `
    }
};
