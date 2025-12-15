require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function listUsers() {
    const { data: users, error } = await supabase.from('users').select('id, email, name');

    if (error) {
        console.error("Error fetching users:", error);
    } else {
        console.log("Registered Users in public.users:");
        users.forEach(u => console.log(`[ID: ${u.id}] ${u.email} (${u.name})`));
    }
}

listUsers();
