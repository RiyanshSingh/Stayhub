require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function inspectUser(emailVariants) {
    for (const email of emailVariants) {
        console.log(`\n\n--- Inspecting: ${email} ---`);

        // 1. Check Registered User
        const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
        let userId = user ? user.id : null;

        if (userId) {
            console.log(`✅ Registered User Found (ID: ${userId})`);
            // Check Linked Bookings
            const { count } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('user_id', userId);
            console.log(`   Linked Bookings (by user_id): ${count}`);
        } else {
            console.log(`❌ No Registered User Account`);
        }

        // 2. Check Guest Bookings (Unlinked)
        const { data: guestBookings } = await supabase.from('bookings').select('id, property_name').eq('guest_email', email);
        if (guestBookings && guestBookings.length > 0) {
            console.log(`   Guest Bookings (by email string): ${guestBookings.length}`);
            guestBookings.forEach(b => console.log(`   - Booked "${b.property_name}" as guest`));
        } else {
            console.log(`   No Guest Bookings found with this specific email string.`);
        }
    }
}

inspectUser(['itasyourriyansh@gmail.com', 'itsyourriyansh@gmail.com']);
