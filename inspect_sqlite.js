import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'server/database.sqlite');
const db = new sqlite3.Database(dbPath);

const tables = [
    'users',
    'properties',
    'bookings',
    'reviews',
    'support_tickets',
    'messages',
    'wishlist',
    'notifications'
];

db.serialize(() => {
    tables.forEach(table => {
        db.all(`PRAGMA table_info(${table})`, (err, rows) => {
            if (err) console.error(err);
            else {
                console.log(`\nTable: ${table}`);
                console.log(rows.map(r => r.name).join(', '));
            }
        });
    });
});
