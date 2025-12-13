const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 5001;
const SECRET_KEY = "your-secret-key-change-this-in-production";

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const fs = require('fs');

// Database Object
let db;

// Initialize Database safely
try {
    // Database Setup
    let dbPath = path.resolve(__dirname, 'database.sqlite');
    // Fallback for Vercel: Check process.cwd() if __dirname fails to find it
    const copyDbFromCwd = path.join(process.cwd(), 'server', 'database.sqlite');

    // Vercel / Serverless Handling: Copy DB to /tmp if we are in a read-only environment
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        const tmpDbPath = '/tmp/database.sqlite';

        // Debugging logs for paths
        console.log('Environment: Production/Vercel');
        console.log('__dirname DB Path:', dbPath);
        console.log('process.cwd() DB Path:', copyDbFromCwd);

        // If the tmp DB doesn't exist, copy the initial one from source
        if (!fs.existsSync(tmpDbPath)) {
            // Try __dirname first
            if (fs.existsSync(dbPath)) {
                fs.copyFileSync(dbPath, tmpDbPath);
                console.log('Copied database from __dirname to /tmp');
            }
            // Try process.cwd() fallback
            else if (fs.existsSync(copyDbFromCwd)) {
                fs.copyFileSync(copyDbFromCwd, tmpDbPath);
                console.log('Copied database from process.cwd() to /tmp');
            } else {
                console.log('Original database not found in either location, creating new empty one in /tmp');
            }
        }
        dbPath = tmpDbPath;
    }

    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database', err.message);
            throw err; // Re-throw to be caught by outer block
        } else {
            console.log(`Connected to the SQLite database at ${dbPath}`);
            console.log('Initializing tables...');

            // ... (Table creation logic stays here or is called here)
            // For brevity in this replacement, we trust the table creation continues if no error
            initializeTables(db);
        }
    });

} catch (error) {
    console.error("CRITICAL DATABASE ERROR:", error);
    // Overwrite app routes to simply return the error
    app.use((req, res) => {
        res.status(500).json({
            message: "Database Initialization Failed",
            error: error.message,
            stack: error.stack,
            paths: {
                dirname: __dirname,
                cwd: process.cwd()
            }
        });
    });
}

// Helper function to keep the table creation code organized
function initializeTables(db) {
    // Create table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        avatar TEXT
    )`, (err) => {
        if (!err) {
            // Attempt to add phone column if it doesn't exist (migration)
            db.run(`ALTER TABLE users ADD COLUMN phone TEXT`, (err) => { /* Ignore */ });
            db.run(`ALTER TABLE users ADD COLUMN address TEXT`, (err) => { /* Ignore */ });
            db.run(`ALTER TABLE users ADD COLUMN gender TEXT`, (err) => { /* Ignore */ });
            db.run(`ALTER TABLE users ADD COLUMN security_question TEXT`, (err) => { /* Ignore */ });
            db.run(`ALTER TABLE users ADD COLUMN security_answer TEXT`, (err) => { /* Ignore */ });
        }
    });

    // Create properties table
    db.run(`CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        slug TEXT UNIQUE,
        description TEXT,
        price REAL,
        location TEXT,
        city TEXT,
        country TEXT,
        type TEXT,
        amenities TEXT,
        images TEXT,
        currency TEXT,
        rating REAL DEFAULT 0,
        reviewCount INTEGER DEFAULT 0,
        category TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Create bookings table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        property_id INTEGER,
        property_name TEXT,
        property_image TEXT,
        check_in TEXT,
        check_out TEXT,
        guests INTEGER,
        total_price REAL,
        nights INTEGER,
        status TEXT DEFAULT 'confirmed',
        cancellation_reason TEXT,
        refund_status TEXT,
        payment_method TEXT,
        transaction_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(property_id) REFERENCES properties(id)
    )`, (err) => {
        if (!err) {
            // Migration: Add new columns if they don't exist
            const columnsToAdd = [
                "ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT",
                "ALTER TABLE bookings ADD COLUMN refund_status TEXT",
                "ALTER TABLE bookings ADD COLUMN payment_method TEXT",
                "ALTER TABLE bookings ADD COLUMN transaction_id TEXT"
            ];
            columnsToAdd.forEach(sql => {
                db.run(sql, (err) => { /* Ignore errors if column exists */ });
            });
        }
    });

    // Create reviews table
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        property_id INTEGER,
        booking_id INTEGER,
        rating REAL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(property_id) REFERENCES properties(id),
        FOREIGN KEY(booking_id) REFERENCES bookings(id)
    )`);

    // Create support tickets table
    db.run(`CREATE TABLE IF NOT EXISTS support_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        booking_id INTEGER,
        subject TEXT,
        status TEXT DEFAULT 'Open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(booking_id) REFERENCES bookings(id)
    )`);

    // Create messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id INTEGER,
        sender TEXT,
        text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(ticket_id) REFERENCES support_tickets(id)
    )`);

    // Create wishlist table
    db.run(`CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        property_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(property_id) REFERENCES properties(id),
        UNIQUE(user_id, property_id)
    )`);

    // Create notifications table
    db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT,
        message TEXT,
        is_read INTEGER DEFAULT 0,
        link TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
}

// Helper to create notification
const createNotification = (userId, type, message, link = null) => {
    db.run(`INSERT INTO notifications (user_id, type, message, link) VALUES (?, ?, ?, ?)`,
        [userId, type, message, link],
        (err) => {
            if (err) console.error("Error creating notification:", err);
        }
    );
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

// ... (existing helper and auth middleware)

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = getAvatar(email);

    const sql = `INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)`;

    db.run(sql, [name, email, hashedPassword, avatar], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ message: "Email already exists" });
            }
            return res.status(500).json({ message: "Error registering user" });
        }

        // Auto-login after register
        const token = jwt.sign({ id: this.lastID, email }, SECRET_KEY, { expiresIn: '24h' });
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: this.lastID, name, email, avatar, phone: null }
        });
    });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;

    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (!user) {
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
                phone: user.phone
            }
        });
    });
});

// Update Profile
app.put('/api/auth/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { name, phone, avatar, address, gender, security_question, security_answer } = req.body;

    db.run(`UPDATE users SET name = ?, phone = ?, avatar = ?, address = ?, gender = ?, security_question = ?, security_answer = ? WHERE id = ?`,
        [name, phone, avatar, address, gender, security_question, security_answer, userId],
        function (err) {
            if (err) {
                return res.status(500).json({ message: "Error updating profile" });
            }

            db.get(`SELECT id, name, email, avatar, phone, address, gender, security_question FROM users WHERE id = ?`, [userId], (err, updatedUser) => {
                if (err || !updatedUser) {
                    return res.status(500).json({ message: "Error fetching updated profile" });
                }
                res.json({ message: "Profile updated", user: updatedUser });
                createNotification(req.user.id, 'profile', `Profile updated successfully`, `/dashboard/profile`);
            });
        });
});
// 1. Init Forgot Password - Get Security Question
app.post('/api/auth/forgot-password-init', (req, res) => {
    const { email } = req.body;
    db.get('SELECT id, security_question FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.security_question) {
            return res.status(400).json({ message: "No security question set for this account. Please contact support." });
        }

        res.json({ security_question: user.security_question });
    });
});

// 2. Verify Security Answer
app.post('/api/auth/verify-security-answer', (req, res) => {
    const { email, answer } = req.body;
    db.get('SELECT id, security_answer FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Simple case-insensitive comparison
        if (user.security_answer && user.security_answer.toLowerCase().trim() === answer.toLowerCase().trim()) {
            // Generate a temporary reset token (signed userId with 15m expiry)
            const resetToken = jwt.sign({ id: user.id, type: 'reset' }, SECRET_KEY, { expiresIn: '15m' });
            return res.json({ resetToken });
        } else {
            return res.status(401).json({ message: "Incorrect answer" });
        }
    });
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

        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id], (err) => {
            if (err) return res.status(500).json({ message: "Error resetting password" });
            res.json({ message: "Password reset successful" });
        });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired reset token" });
    }
});

// --- Property Routes ---

// Create Property
app.post('/api/properties', authenticateToken, (req, res) => {
    const { name, description, price, location, city, country, type, amenities, images, currency, category } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    const sql = `INSERT INTO properties (user_id, name, slug, description, price, location, city, country, type, amenities, images, currency, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Store arrays as JSON strings
    const amenitiesStr = JSON.stringify(amenities || []);
    const imagesStr = JSON.stringify(images || []);

    db.run(sql, [req.user.id, name, slug, description, price, location, city, country, type, amenitiesStr, imagesStr, currency, category], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error creating property" });
        }
        res.status(201).json({ message: "Property created", id: this.lastID, slug });
    });
});

// Get User's Properties
app.get('/api/properties/user', authenticateToken, (req, res) => {
    const sql = `SELECT * FROM properties WHERE user_id = ? ORDER BY id DESC`;
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        // Parse JSON strings back to arrays
        const properties = rows.map(row => ({
            ...row,
            amenities: JSON.parse(row.amenities || '[]'),
            images: JSON.parse(row.images || '[]')
        }));
        res.json(properties);
    });
});

// Get All Properties (For Explore)
app.get('/api/properties', (req, res) => {
    const sql = `SELECT * FROM properties ORDER BY id DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        const properties = rows.map(row => ({
            ...row,
            amenities: JSON.parse(row.amenities || '[]'),
            images: JSON.parse(row.images || '[]')
        }));
        res.json(properties);
    });
});

// Update Property
app.put('/api/properties/:id', authenticateToken, (req, res) => {
    const { name, description, price, location, city, country, type, amenities, images, currency, category } = req.body;
    const propertyId = req.params.id;

    // Check ownership first
    db.get(`SELECT user_id FROM properties WHERE id = ?`, [propertyId], (err, row) => {
        if (err || !row) return res.status(404).json({ message: "Property not found" });
        if (row.user_id !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        const sql = `UPDATE properties SET name=?, description=?, price=?, location=?, city=?, country=?, type=?, amenities=?, images=?, currency=?, category=? WHERE id=?`;
        const amenitiesStr = JSON.stringify(amenities || []);
        const imagesStr = JSON.stringify(images || []);

        db.run(sql, [name, description, price, location, city, country, type, amenitiesStr, imagesStr, currency, category, propertyId], function (err) {
            if (err) return res.status(500).json({ message: "Error updating property" });
            res.json({ message: "Property updated successfully" });
        });
    });
});

// Delete Property
app.delete('/api/properties/:id', authenticateToken, (req, res) => {
    const propertyId = req.params.id;

    db.get(`SELECT user_id FROM properties WHERE id = ?`, [propertyId], (err, row) => {
        if (err || !row) return res.status(404).json({ message: "Property not found" });
        if (row.user_id !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

        db.run(`DELETE FROM properties WHERE id = ?`, [propertyId], function (err) {
            if (err) return res.status(500).json({ message: "Error deleting property" });
            res.json({ message: "Property deleted successfully" });
        });
    });
});

// --- Booking Routes ---

// Create Booking
app.post('/api/bookings', authenticateToken, (req, res) => {
    const { property_id, property_name, property_image, check_in, check_out, guests, total_price, nights, payment_method } = req.body;
    const transaction_id = 'TXN' + Date.now(); // Mock transaction ID

    const sql = `INSERT INTO bookings (user_id, property_id, property_name, property_image, check_in, check_out, guests, total_price, nights, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [req.user.id, property_id, property_name, property_image, check_in, check_out, guests, total_price, nights, payment_method, transaction_id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error creating booking" });
        }
        res.status(201).json({ message: "Booking created", id: this.lastID });
        createNotification(req.user.id, 'booking', `Booking confirmed for ${property_name}`, `/dashboard/bookings/${this.lastID}`);
    });
});

// Get User Bookings
app.get('/api/bookings/user', authenticateToken, (req, res) => {
    const sql = `SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC`;
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(rows);
    });
});

// Get Single Booking Details
app.get('/api/bookings/:id', authenticateToken, (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    // Get booking
    db.get(`SELECT * FROM bookings WHERE id = ? AND user_id = ?`, [bookingId, userId], (err, booking) => {
        if (err || !booking) return res.status(404).json({ message: "Booking not found" });

        // Get property details
        db.get(`SELECT * FROM properties WHERE id = ?`, [booking.property_id], (err, property) => {
            const propertyData = property ? {
                ...property,
                amenities: JSON.parse(property.amenities || '[]'),
                images: JSON.parse(property.images || '[]')
            } : null;

            // Get review if exists
            db.get(`SELECT * FROM reviews WHERE booking_id = ?`, [bookingId], (err, review) => {

                // Get support tickets
                db.all(`SELECT * FROM support_tickets WHERE booking_id = ?`, [bookingId], (err, tickets) => {

                    res.json({
                        ...booking,
                        property: propertyData,
                        review: review || null,
                        tickets: tickets || []
                    });
                });
            });
        });
    });
});

// Cancel Booking
app.post('/api/bookings/:id/cancel', authenticateToken, (req, res) => {
    const bookingId = req.params.id;
    const { reason } = req.body;

    db.run(`UPDATE bookings SET status = 'cancelled', cancellation_reason = ?, refund_status = 'processing' WHERE id = ? AND user_id = ?`,
        [reason, bookingId, req.user.id],
        function (err) {
            if (err) return res.status(500).json({ message: "Error cancelling booking" });
            res.json({ message: "Booking cancelled successfully" });
            createNotification(req.user.id, 'booking', `Booking cancelled`, `/dashboard/bookings/${bookingId}`);
        }
    );
});

// Post Review
app.post('/api/reviews', authenticateToken, (req, res) => {
    const { property_id, booking_id, rating, comment } = req.body;

    // Verify booking matches user
    db.get(`SELECT * FROM bookings WHERE id = ? AND user_id = ?`, [booking_id, req.user.id], (err, booking) => {
        if (err || !booking) return res.status(403).json({ message: "Invalid booking" });

        db.run(`INSERT INTO reviews (user_id, property_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)`,
            [req.user.id, property_id, booking_id, rating, comment],
            function (err) {
                if (err) return res.status(500).json({ message: "Error submitting review" });

                // Update booking status to completed/reviewed if needed, or just let UI handle it
                createNotification(req.user.id, 'review', `Review submitted for booking #${booking_id}`, `/dashboard`);
                res.status(201).json({ message: "Review submitted", id: this.lastID });
            }
        );
    });
});

// Create Support Ticket
app.post('/api/support/tickets', authenticateToken, (req, res) => {
    const { booking_id, subject, message } = req.body;

    db.run(`INSERT INTO support_tickets (user_id, booking_id, subject) VALUES (?, ?, ?)`,
        [req.user.id, booking_id, subject],
        function (err) {
            if (err) return res.status(500).json({ message: "Error creating ticket" });
            const ticketId = this.lastID;

            // Add initial message
            db.run(`INSERT INTO messages (ticket_id, sender, text) VALUES (?, 'user', ?)`,
                [ticketId, message],
                (err) => {
                    res.status(201).json({ message: "Ticket created", id: ticketId });
                    createNotification(req.user.id, 'support', `Support ticket #${ticketId} created`, `/dashboard`);
                }
            );
        }
    );
});


// --- Wishlist Routes ---

// Get User Wishlist
app.get('/api/wishlist', authenticateToken, (req, res) => {
    const sql = `
        SELECT p.*, w.id as wishlist_id, w.created_at as saved_at 
        FROM wishlist w
        JOIN properties p ON w.property_id = p.id
        WHERE w.user_id = ?
        ORDER BY w.created_at DESC
    `;
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error" });

        const wishlist = rows.map(row => ({
            ...row,
            amenities: JSON.parse(row.amenities || '[]'),
            images: JSON.parse(row.images || '[]')
        }));
        res.json(wishlist);
    });
});

// Add to Wishlist
app.post('/api/wishlist', authenticateToken, (req, res) => {
    const { property_id } = req.body;
    db.run(`INSERT INTO wishlist (user_id, property_id) VALUES (?, ?)`,
        [req.user.id, property_id],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: "Property already in wishlist" });
                }
                return res.status(500).json({ message: "Error adding to wishlist" });
            }
            res.status(201).json({ message: "Added to wishlist", id: this.lastID });
            createNotification(req.user.id, 'wishlist', `Property added to wishlist`, `/dashboard`);
        }
    );
});

// Remove from Wishlist
app.delete('/api/wishlist/:property_id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM wishlist WHERE user_id = ? AND property_id = ?`,
        [req.user.id, req.params.property_id],
        function (err) {
            if (err) return res.status(500).json({ message: "Error removing from wishlist" });
            res.json({ message: "Removed from wishlist" });
        }
    );
});
// --- Notification Routes ---

// Get User Notifications
app.get('/api/notifications', authenticateToken, (req, res) => {
    const sql = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(rows);
    });
});

// Mark Notification as Read
app.put('/api/notifications/:id/read', authenticateToken, (req, res) => {
    const sql = `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`;
    db.run(sql, [req.params.id, req.user.id], function (err) {
        if (err) return res.status(500).json({ message: "Error updating notification" });
        res.json({ message: "Notification marked as read" });
    });
});

// Mark All as Read
app.put('/api/notifications/read-all', authenticateToken, (req, res) => {
    const sql = `UPDATE notifications SET is_read = 1 WHERE user_id = ?`;
    db.run(sql, [req.user.id], function (err) {
        if (err) return res.status(500).json({ message: "Error updating notifications" });
        res.json({ message: "All notifications marked as read" });
    });
});

// Start Server
if (require.main === module) {
    console.log('Attempting to start server on port', PORT);
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
