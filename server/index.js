import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load env vars

// Gemini API Setup
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

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

let supabase;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables.");
    // Initialize a dummy client or validation will fail on usage, but server won't crash on boot
    supabase = {
        from: () => ({ select: () => ({ eq: () => ({ single: () => ({ error: { message: "DB Config Missing" } }) }) }) })
    };
} else {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log(`Connected to Supabase at ${supabaseUrl}`);
    } catch (err) {
        console.error("Failed to initialize Supabase:", err.message);
        supabase = null; // or dummy
    }
}

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

// Helper to link guest bookings to new user
const linkGuestBookings = async (userId, email) => {
    try {
        const { error } = await supabase
            .from('bookings')
            .update({ user_id: userId })
            .eq('guest_email', email)
            .is('user_id', null);

        if (error) console.error("Error linking guest bookings:", error);
        else console.log(`Linked guest bookings for ${email} to user ${userId}`);
    } catch (err) {
        console.error("Exception linking guest bookings:", err);
    }
};

// ...

// Helper to generate IDs
function generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 5; i++) {
        // Random 8 character string
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        codes.push({ code, used: false });
    }
    return codes;
}

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, security_question, security_answer } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatar = getAvatar(email);
        const backup_codes = generateBackupCodes(); // Generate 5 codes

        const { data, error } = await supabase
            .from('users')
            .insert([{
                name,
                email,
                password: hashedPassword,
                avatar,
                security_question,
                security_answer,
                backup_codes
            }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Postgres unique violation code
                return res.status(400).json({ message: "Email already exists" });
            }
            throw error;
        }

        // Link any previous guest bookings
        await linkGuestBookings(data.id, email);

        // Auto-login after register
        const token = jwt.sign({ id: data.id, email }, SECRET_KEY, { expiresIn: '24h' });
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: data.id, name, email, avatar, phone: null },
            backupCodes: backup_codes.map(c => c.code) // Send codes to frontend
        });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Verify Backup Code (Recovery)
app.post('/api/auth/verify-backup-code', async (req, res) => {
    const { email, code } = req.body;
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, backup_codes')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(404).json({ message: "User not found" });

        const codes = user.backup_codes || [];
        const codeIndex = codes.findIndex(c => c.code === code && !c.used);

        if (codeIndex === -1) {
            return res.status(400).json({ message: "Invalid or already used backup code." });
        }

        // Mark as used
        codes[codeIndex].used = true;

        const { error: updateError } = await supabase
            .from('users')
            .update({ backup_codes: codes })
            .eq('id', user.id);

        if (updateError) throw updateError;

        // Generate temporary reset token
        const resetToken = jwt.sign({ id: user.id, type: 'reset' }, SECRET_KEY, { expiresIn: '15m' });
        return res.json({ resetToken });

    } catch (err) {
        console.error("Backup Code Verify Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Regenerate Backup Codes (Protected)
app.post('/api/auth/regenerate-backup-codes', authenticateToken, async (req, res) => {
    try {
        const newCodes = generateBackupCodes();

        const { error } = await supabase
            .from('users')
            .update({ backup_codes: newCodes })
            .eq('id', req.user.id);

        if (error) throw error;

        res.json({ message: "New codes generated", backupCodes: newCodes.map(c => c.code) });

    } catch (err) {
        console.error("Regenerate Codes Error:", err);
        res.status(500).json({ message: "server error" });
    }
});

// Get Backup Codes (Protected)
app.get('/api/auth/backup-codes', authenticateToken, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('backup_codes')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;

        // Return codes with their used status
        res.json({ backupCodes: user.backup_codes || [] });

    } catch (err) {
        console.error("Get Codes Error:", err);
        res.status(500).json({ message: "Server error" });
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
            // Also attempt to link bookings just in case they made guest bookings while logged out
            await linkGuestBookings(user.id, user.email);

            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
            return res.json({
                message: "Google Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    phone: user.phone || null,
                    address: user.address || null,
                    gender: user.gender || null
                }
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

            if (createError) {
                // If email already exists (race condition or soft mismatch), try to login
                if (createError.code === '23505') {
                    const { data: existingUser, error: fetchError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('email', mockGoogleUser.email)
                        .single();

                    if (fetchError || !existingUser) throw createError; // If still can't find, throw original

                    // Proceed with login for existingUser
                    await linkGuestBookings(existingUser.id, existingUser.email);
                    const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, SECRET_KEY, { expiresIn: '24h' });
                    return res.status(200).json({
                        message: "Google Login successful (recovered)",
                        token,
                        user: { id: existingUser.id, name: existingUser.name, email: existingUser.email, avatar: existingUser.avatar, phone: existingUser.phone || null }
                    });
                }
                throw createError;
            }

            // Link guest bookings
            await linkGuestBookings(newUser.id, mockGoogleUser.email);

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
                phone: user.phone || null,
                address: user.address || null,
                gender: user.gender || null
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

    // Default status is now 'pending' for approval workflow
    const status = 'pending';

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
                category,
                status     // Add status
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: "Property created", id: data.id, slug: data.slug });
    } catch (err) {
        console.error("Create Property Error:", err);
        res.status(500).json({ message: "Error creating property", error: err.message || err });
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
            .eq('status', 'approved') // Only show approved properties
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

// Middleware to optionally authenticate token (for guest checkout)
const optionalAuthenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            req.user = null; // Invalid token treated as guest
        } else {
            req.user = user;
        }
        next();
    });
};

// ...

// Create Booking (Supports Auth User OR Guest)
app.post('/api/bookings', optionalAuthenticateToken, async (req, res) => {
    const {
        property_id, property_name, property_image,
        check_in, check_out, guests, total_price, nights,
        payment_method,
        // Guest Details
        guest_name, guest_email, guest_phone, special_requests
    } = req.body;

    const transaction_id = 'TXN' + Date.now();

    try {
        // Validation: Must have User ID OR Guest Details
        if (!req.user && (!guest_name || !guest_email)) {
            return res.status(400).json({ message: "Guest name and email are required for guest checkout" });
        }

        const bookingData = {
            user_id: req.user ? req.user.id : null,
            property_id,
            property_name,
            property_image,
            check_in,
            check_out,
            guests,
            total_price,
            nights,
            payment_method,
            transaction_id,
            // Add guest fields
            guest_name: req.user ? req.user.name : guest_name, // Fallback to user name if logged in
            guest_email: req.user ? req.user.email : guest_email,
            guest_phone: req.user ? (req.user.phone || guest_phone) : guest_phone,
            special_requests
        };

        const { data, error } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();

        if (error) throw error;

        // If registered user, send notification
        if (req.user) {
            createNotification(req.user.id, 'booking', `Booking confirmed for ${property_name}`, `/dashboard/bookings/${data.id}`);
        }

        // TODO: specific notification or email for guest (omitted for now)

        res.status(201).json({ message: "Booking created", id: data.id });


    } catch (err) {
        console.error("Create Booking Error:", err);
        res.status(500).json({ message: "Error creating booking", error: err.message });
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
// --- Admin Routes ---

// Admin Login
// Admin Login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // In a real app, compare hashed password. Here we compare plain text as per setup.
        if (admin.password === password) {
            const token = jwt.sign({ id: admin.id, role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
            res.json({ message: "Admin login successful", token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Admin Middleware
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err || user.role !== 'admin') return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Get Pending Properties
app.get('/api/admin/properties/pending', authenticateAdmin, async (req, res) => {
    try {
        const { data: properties, error } = await supabase
            .from('properties')
            .select('*, users(name, email)') // Join with users to see who posted it
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(properties);
    } catch (err) {
        console.error("Get Pending Properties Error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

// Approve Property
app.put('/api/admin/properties/:id/approve', authenticateAdmin, async (req, res) => {
    const propertyId = req.params.id;
    try {
        const { error } = await supabase
            .from('properties')
            .update({ status: 'approved' })
            .eq('id', propertyId);

        if (error) throw error;

        // Notify the user (optional, but good UX)
        // We'd need to fetch the property first to get the user_id, but let's skip for simplicity/speed or add a quick fetch
        const { data: prop } = await supabase.from('properties').select('user_id, name').eq('id', propertyId).single();
        if (prop) {
            createNotification(prop.user_id, 'system', `Your property "${prop.name}" has been approved and is now live!`, `/hotel/${prop.slug || propertyId}`);
        }

        res.json({ message: "Property approved successfully" });
    } catch (err) {
        console.error("Approve Property Error:", err);
        res.status(500).json({ message: "Error approving property" });
    }
});


// Chat Endpoint
app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!genAI) {
        return res.json({
            response: "I'm ready to help, but my brain (API Key) is missing! Please ask the admin to add the GEMINI_API_KEY to the server."
        });
    }

    try {
        let userContext = "";
        let userName = "Guest";

        // 1. Verify Token & Fetch User Context if logged in
        if (token) {
            try {
                const decoded = jwt.verify(token, SECRET_KEY);
                const userId = decoded.id;

                // Fetch Profile
                const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
                if (user) {
                    userName = user.name;
                    userContext += `\nLogged-in User: ${user.name} (${user.email}). Phone: ${user.phone || 'Not set'}. Address: ${user.address || 'Not set'}.`;
                }

                // Fetch Recent Bookings
                const { data: bookings } = await supabase
                    .from('bookings')
                    .select('id, property_name, check_in, check_out, status, total_price, payment_method, guests, special_requests')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (bookings && bookings.length > 0) {
                    userContext += `\nRecent Bookings:\n${bookings.map(b => `- ${b.property_name} (${b.status}): ${b.check_in} to ${b.check_out}. Paid: ${b.total_price} via ${b.payment_method}. Guests: ${b.guests}. Notes: ${b.special_requests || 'None'}`).join('\n')}`;
                } else {
                    userContext += `\nNo recent bookings.`;
                }

                // Fetch User Properties (Host Context)
                const { data: myProperties } = await supabase
                    .from('properties')
                    .select('name, city, status, price')
                    .eq('user_id', userId);

                if (myProperties && myProperties.length > 0) {
                    userContext += `\nMy Listed Properties:\n${myProperties.map(p => `- ${p.name} in ${p.city} (${p.status}, ₹${p.price})`).join('\n')}`;
                }

                // Fetch Wishlist
                const { data: wishlist } = await supabase
                    .from('wishlist')
                    .select('property_id')
                    .eq('user_id', userId);

                if (wishlist && wishlist.length > 0) {
                    userContext += `\nItems in Wishlist: ${wishlist.length}`;
                }

            } catch (jwtErr) {
                console.log("Chat Token Invalid/Expired:", jwtErr.message);
                // Continue as guest
            }
        }

        // 2. Fetch Global Hotel Context (Keep existing RAG-lite)
        const { data: hotels } = await supabase
            .from('properties')
            .select('name, city, price, type, rating')
            .eq('status', 'approved')
            .limit(20);

        const hotelContext = hotels ? hotels.map(h => `- ${h.name} (${h.type}) in ${h.city}, approx ₹${h.price}/night. Rated ${h.rating || 'New'}`).join('\n') : "No hotels available right now.";

        // 3. Construct System Prompt
        const systemPrompt = `You are StayHub AI, an expert travel assistant.
        
        Current User: ${userName}
        ${userContext}
        
        Available Hotels:
        ${hotelContext}
        
        Capabilities:
        1. Answer questions about the user's bookings ("Where am I going next?").
        2. Help update profile ("How do I change my phone number?").
        3. Recommend hotels and explain booking.
        4. If user is NOT logged in and asks to login/book, reply exactly: "[SHOW_LOGIN_FORM]" (nothing else).
        
        Rules:
        - Be friendly and concise.
        - If the user asks to login, strictly output keyphrase: "[SHOW_LOGIN_FORM]".
        - Do not expose raw IDs.
        
        User Query: ${message}`;

        // Sanitize history & Limit to last 10 messages
        let validHistory = (history || []).filter(msg => msg.role === 'user' || msg.role === 'model');
        if (validHistory.length > 10) validHistory = validHistory.slice(-10);
        while (validHistory.length > 0 && validHistory[0].role === 'model') {
            validHistory.shift();
        }

        // List of models to try in order of preference
        const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"];
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting chat with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const chat = model.startChat({
                    history: validHistory,
                    generationConfig: { maxOutputTokens: 1000 },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                    ]
                });

                const result = await chat.sendMessage(systemPrompt);
                const text = result.response.text();

                // If successful, send response and exit loop
                return res.json({ response: text });

            } catch (err) {
                console.warn(`Failed with ${modelName}:`, err.message);
                lastError = err;
                // If 429 (Quota) or 404 (Not Found), continue to next model. 
                // Otherwise, it might be a prompt issue, but we'll try falling back anyway to be safe.
                continue;
            }
        }

        // If we exhausted all models
        console.error("All models failed. Last error:", lastError);
        const errorMessage = lastError?.message || "Unknown error";
        if (errorMessage.includes("SAFETY")) {
            res.json({ response: "I cannot complete this request due to safety filters. Please rephrase." });
        } else {
            res.status(500).json({ response: `I'm having trouble thinking right now. (All models failed. Last error: ${errorMessage})` });
        }

    } catch (err) {
        console.error("Critical Chat Error:", err);
        res.status(500).json({ response: "System error in chatbot." });
    }
});

// Start Server only if run directly
if (process.argv[1] === __filename) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
