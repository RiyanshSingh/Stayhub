import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load env vars

// Supabase Client
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = "your-secret-key-change-this-in-production";

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables.");
    console.error("Please create a .env file based on .env.example");
    // We don't exit process to allow it to run, but DB calls will fail
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`Connected to Supabase at ${supabaseUrl}`);

// Helper to create notification
const createNotification = async (userId, type, message, link = null) => {
    const { error } = await supabase
        .from('notifications')
        .insert([{ user_id: userId, type, message, link, is_read: 0 }]);

    if (error) console.error("Error creating notification:", error);
};

// Helper function to generate avatar
const getAvatar = (email) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatar = getAvatar(email);

        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword, avatar }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Postgres unique violation code
                return res.status(400).json({ message: "Email already exists" });
            }
            throw error;
        }

        // Auto-login after register
        const token = jwt.sign({ id: data.id, email }, SECRET_KEY, { expiresIn: '24h' });
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: data.id, name, email, avatar, phone: null }
        });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Mock Google Login
app.post('/api/auth/google', async (req, res) => {
    const mockGoogleUser = {
        name: "Google User",
        email: "user@gmail.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
        phone: null
    };

    try {
        // Check if user exists
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', mockGoogleUser.email)
            .single();

        if (!user && error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            throw error;
        }

        if (user) {
            // Login existing
            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
            return res.json({
                message: "Google Login successful",
                token,
                user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, phone: user.phone || null }
            });
        } else {
            // Register new
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{
                    name: mockGoogleUser.name,
                    email: mockGoogleUser.email,
                    password: 'google-oauth-mock-pass',
                    avatar: mockGoogleUser.avatar
                }])
                .select()
                .single();

            if (createError) throw createError;

            const token = jwt.sign({ id: newUser.id, email: mockGoogleUser.email }, SECRET_KEY, { expiresIn: '24h' });
            return res.status(201).json({
                message: "Google Login successful",
                token,
                user: { id: newUser.id, ...mockGoogleUser }
            });
        }
    } catch (err) {
        console.error("Google Login Error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone || null
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Update Profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { name, phone, avatar, address, gender, security_question, security_answer } = req.body;

    try {
        const { error } = await supabase
            .from('users')
            .update({ name, phone, avatar, address, gender, security_question, security_answer })
            .eq('id', userId);

        if (error) throw error;

        const { data: updatedUser, error: fetchError } = await supabase
            .from('users')
            .select('id, name, email, avatar, phone, address, gender, security_question')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        res.json({ message: "Profile updated", user: updatedUser });
        createNotification(req.user.id, 'profile', `Profile updated successfully`, `/dashboard/profile`);

    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({ message: "Error updating profile" });
    }
});

// 1. Init Forgot Password - Get Security Question
app.post('/api/auth/forgot-password-init', async (req, res) => {
    const { email } = req.body;
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, security_question')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(404).json({ message: "User not found" });

        if (!user.security_question) {
            return res.status(400).json({ message: "No security question set for this account. Please contact support." });
        }

        res.json({ security_question: user.security_question });
    } catch (err) {
        console.error("Forgot Password Init Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 2. Verify Security Answer
app.post('/api/auth/verify-security-answer', async (req, res) => {
    const { email, answer } = req.body;
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, security_answer')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(404).json({ message: "User not found" });

        // Simple case-insensitive comparison
        if (user.security_answer && user.security_answer.toLowerCase().trim() === answer.toLowerCase().trim()) {
            // Generate a temporary reset token (signed userId with 15m expiry)
            const resetToken = jwt.sign({ id: user.id, type: 'reset' }, SECRET_KEY, { expiresIn: '15m' });
            return res.json({ resetToken });
        } else {
            return res.status(401).json({ message: "Incorrect answer" });
        }
    } catch (err) {
        console.error("Verify Security Answer Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// 3. Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, newPassword, resetToken } = req.body;

    if (!resetToken) {
        return res.status(400).json({ message: "Reset token missing" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(resetToken, SECRET_KEY);

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const { error } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('id', decoded.id);

        if (error) throw error;

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(401).json({ message: "Invalid or expired reset token or Server Error" });
    }
});

// --- Property Routes ---

// Create Property
app.post('/api/properties', authenticateToken, async (req, res) => {
    const { name, description, price, location, city, country, type, amenities, images, currency, category } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    // Supabase handles JSON natively (assuming JSONB columns), so we pass arrays directly
    // If we used TEXT columns, we would strictly stringify, but let's assume JSONB support as per schema

    try {
        const { data, error } = await supabase
            .from('properties')
            .insert([{
                user_id: req.user.id,
                name,
                slug,
                description,
                price,
                location,
                city,
                country,
                type,
                amenities, // Pass array directly
                images,    // Pass array directly
                currency,
                category
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: "Property created", id: data.id, slug: data.slug });
    } catch (err) {
        console.error("Create Property Error:", err);
        res.status(500).json({ message: "Error creating property" });
    }
});

// Get User's Properties
app.get('/api/properties/user', authenticateToken, async (req, res) => {
    try {
        const { data: properties, error } = await supabase
            .from('properties')
            .select('*')
            .eq('user_id', req.user.id)
            .order('id', { ascending: false });

        if (error) throw error;

        // Note: parsing JSON 'amenities'/'images' is automatic with Supabase if columns are JSONB
        res.json(properties);
    } catch (err) {
        console.error("Get User Properties Error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Get All Properties (For Explore)
app.get('/api/properties', async (req, res) => {
    try {
        const { data: properties, error } = await supabase
            .from('properties')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;
        res.json(properties);
    } catch (err) {
        console.error("Get All Properties Error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Update Property
app.put('/api/properties/:id', authenticateToken, async (req, res) => {
    const { name, description, price, location, city, country, type, amenities, images, currency, category } = req.body;
    const propertyId = req.params.id;

    try {
        // Check ownership
        const { data: property, error: fetchError } = await supabase
            .from('properties')
            .select('user_id')
            .eq('id', propertyId)
            .single();

        if (fetchError || !property) return res.status(404).json({ message: "Property not found" });
        if (property.user_id != req.user.id) return res.status(403).json({ message: "Unauthorized" });

        const { error } = await supabase
            .from('properties')
            .update({ name, description, price, location, city, country, type, amenities, images, currency, category })
            .eq('id', propertyId);

        if (error) throw error;
        res.json({ message: "Property updated successfully" });

    } catch (err) {
        console.error("Update Property Error:", err);
        res.status(500).json({ message: "Error updating property" });
    }
});

// Delete Property
app.delete('/api/properties/:id', authenticateToken, async (req, res) => {
    const propertyId = req.params.id;

    try {
        // Check ownership
        const { data: property, error: fetchError } = await supabase
            .from('properties')
            .select('user_id')
            .eq('id', propertyId)
            .single();

        if (fetchError || !property) return res.status(404).json({ message: "Property not found" });
        if (property.user_id != req.user.id) return res.status(403).json({ message: "Unauthorized" });

        const { error } = await supabase
            .from('properties')
            .delete()
            .eq('id', propertyId);

        if (error) throw error;
        res.json({ message: "Property deleted successfully" });
    } catch (err) {
        console.error("Delete Property Error:", err);
        res.status(500).json({ message: "Error deleting property" });
    }
});

// --- Booking Routes ---

// Create Booking
app.post('/api/bookings', authenticateToken, async (req, res) => {
    const { property_id, property_name, property_image, check_in, check_out, guests, total_price, nights, payment_method } = req.body;
    const transaction_id = 'TXN' + Date.now(); // Mock transaction ID

    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                user_id: req.user.id,
                property_id,
                property_name,
                property_image,
                check_in,
                check_out,
                guests,
                total_price,
                nights,
                payment_method,
                transaction_id
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: "Booking created", id: data.id });
        createNotification(req.user.id, 'booking', `Booking confirmed for ${property_name}`, `/dashboard/bookings/${data.id}`);

    } catch (err) {
        console.error("Create Booking Error:", err);
        res.status(500).json({ message: "Error creating booking" });
    }
});

// Get User Bookings
app.get('/api/bookings/user', authenticateToken, async (req, res) => {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(bookings);
    } catch (err) {
        console.error("Get User Bookings Error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Get Single Booking Details
app.get('/api/bookings/:id', authenticateToken, async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    try {
        // Get booking
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .eq('user_id', userId)
            .single();

        if (bookingError || !booking) return res.status(404).json({ message: "Booking not found" });

        // Get property details
        const { data: property, error: propertyError } = await supabase
            .from('properties')
            .select('*')
            .eq('id', booking.property_id)
            .single();

        // Get review
        const { data: review } = await supabase
            .from('reviews')
            .select('*')
            .eq('booking_id', bookingId)
            .maybeSingle();

        // Get tickets
        const { data: tickets } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('booking_id', bookingId);

        res.json({
            ...booking,
            property: property || null, // property handles its own JSONB
            review: review || null,
            tickets: tickets || []
        });

    } catch (err) {
        console.error("Get Booking Details Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Cancel Booking
app.post('/api/bookings/:id/cancel', authenticateToken, async (req, res) => {
    const bookingId = req.params.id;
    const { reason } = req.body;

    try {
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled', cancellation_reason: reason, refund_status: 'processing' })
            .eq('id', bookingId)
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.json({ message: "Booking cancelled successfully" });
        createNotification(req.user.id, 'booking', `Booking cancelled`, `/dashboard/bookings/${bookingId}`);

    } catch (err) {
        console.error("Cancel Booking Error:", err);
        res.status(500).json({ message: "Error cancelling booking" });
    }
});

// Post Review
app.post('/api/reviews', authenticateToken, async (req, res) => {
    const { property_id, booking_id, rating, comment } = req.body;

    try {
        // Verify booking matches user
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('id')
            .eq('id', booking_id)
            .eq('user_id', req.user.id)
            .single();

        if (bookingError || !booking) return res.status(403).json({ message: "Invalid booking" });

        const { data, error } = await supabase
            .from('reviews')
            .insert([{ user_id: req.user.id, property_id, booking_id, rating, comment }])
            .select()
            .single();

        if (error) throw error;

        createNotification(req.user.id, 'review', `Review submitted for booking #${booking_id}`, `/dashboard`);
        res.status(201).json({ message: "Review submitted", id: data.id });
    } catch (err) {
        console.error("Submit Review Error:", err);
        res.status(500).json({ message: "Error submitting review" });
    }
});

// Create Support Ticket
app.post('/api/support/tickets', authenticateToken, async (req, res) => {
    const { booking_id, subject, message } = req.body;

    try {
        const { data: ticket, error: ticketError } = await supabase
            .from('support_tickets')
            .insert([{ user_id: req.user.id, booking_id, subject }])
            .select()
            .single();

        if (ticketError) throw ticketError;

        const ticketId = ticket.id;

        const { error: msgError } = await supabase
            .from('messages')
            .insert([{ ticket_id: ticketId, sender: 'user', text: message }]);

        if (msgError) throw msgError;

        res.status(201).json({ message: "Ticket created", id: ticketId });
        createNotification(req.user.id, 'support', `Support ticket #${ticketId} created`, `/dashboard`);

    } catch (err) {
        console.error("Create Ticket Error:", err);
        res.status(500).json({ message: "Error creating ticket" });
    }
});

// --- Wishlist Routes ---

// Get User Wishlist
app.get('/api/wishlist', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('wishlist')
            .select(`
                wishlist_id:id,
                saved_at:created_at,
                property:properties (*)
            `)
            .eq('user_id', req.user.id);

        if (error) throw error;

        // Transform response to match previous flat structure if needed, or update frontend to read property object
        // Previous SQL: SELECT p.*, w.id as wishlist_id ...
        // So it returned a flat object of property fields + wishlist_id.
        // We must flatten it to avoid breaking frontend.

        const flattened = data.map(item => ({
            ...item.property,
            wishlist_id: item.wishlist_id,
            saved_at: item.saved_at
        }));

        res.json(flattened);
    } catch (err) {
        console.error("Get Wishlist Error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Add/Remove Wishlist (Toggle)
app.post('/api/wishlist/toggle', authenticateToken, async (req, res) => {
    const { property_id } = req.body;
    const userId = req.user.id;

    try {
        // Check if exists
        const { data: existing, error: fetchError } = await supabase
            .from('wishlist')
            .select('id')
            .eq('user_id', userId)
            .eq('property_id', property_id)
            .maybeSingle();

        if (existing) {
            // Remove
            await supabase.from('wishlist').delete().eq('id', existing.id);
            res.json({ message: "Removed from wishlist", added: false });
        } else {
            // Add
            await supabase.from('wishlist').insert([{ user_id: userId, property_id }]);
            res.json({ message: "Added to wishlist", added: true });
        }
    } catch (err) {
        console.error("Toggle Wishlist Error:", err);
        res.status(500).json({ message: "Error updating wishlist" });
    }
});


// --- Notifications ---
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

app.put('/api/notifications/read-all', authenticateToken, async (req, res) => {
    try {
        await supabase
            .from('notifications')
            .update({ is_read: 1 })
            .eq('user_id', req.user.id);
        res.json({ message: "All marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Error updating notifications" });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
