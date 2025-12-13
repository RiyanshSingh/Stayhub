import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY. Make sure .env is set.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const cities = [
    { city: "Mumbai", country: "India", basePrice: 4000, category: "luxury" },
    { city: "Delhi", country: "India", basePrice: 3500, category: "business" },
    { city: "Bangalore", country: "India", basePrice: 3000, category: "business" },
    { city: "Goa", country: "India", basePrice: 5000, category: "resort" },
    { city: "Jaipur", country: "India", basePrice: 3200, category: "boutique" },
    { city: "Udaipur", country: "India", basePrice: 4500, category: "luxury" },
    { city: "Kerala", country: "India", basePrice: 3800, category: "resort" },
    { city: "Chennai", country: "India", basePrice: 2800, category: "business" },
];

const types = ["Hotel", "Apartment", "Resort", "Villa", "Loft"];
const amenitiesList = ["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Parking", "Bar"];
const propertyImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000"
];

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

async function seedProperties() {
    console.log("Starting seed process...");

    // Create a default user first to assign properties to
    // We'll try to find one or create one
    let userId;
    const { data: user, error: userError } = await supabase.from('users').select('id').limit(1).single();

    if (user) {
        userId = user.id;
    } else {
        console.log("Creating default seed user...");
        const { data: newUser, error: createError } = await supabase.from('users').insert([{
            name: "Seed User",
            email: "seed@example.com",
            password: "seedpassword123",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=seed"
        }]).select().single();

        if (createError) {
            console.error("Error creating user:", createError);
            return;
        }
        userId = newUser.id;
    }

    const propertiesToInsert = [];

    cities.forEach(dest => {
        for (let i = 1; i <= 5; i++) { // Reduced to 5 per city to be faster (40 total)
            const type = types[Math.floor(Math.random() * types.length)];
            const name = `${dest.city} ${type} ${i}`;
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() + i;
            const price = dest.basePrice + Math.floor(Math.random() * 2000) - 500;
            const description = `Experience the best of ${dest.city} in this beautiful ${type.toLowerCase()}. Located near top attractions with premium amenities.`;
            const amenities = getRandomSubarray(amenitiesList, 4);
            const images = getRandomSubarray(propertyImages, 3);

            propertiesToInsert.push({
                user_id: userId,
                name,
                slug,
                description,
                price,
                location: "City Center",
                city: dest.city,
                country: dest.country,
                type,
                amenities,
                images,
                currency: "INR",
                category: dest.category
            });
        }
    });

    console.log(`Preparing to insert ${propertiesToInsert.length} properties...`);

    const { error } = await supabase.from('properties').insert(propertiesToInsert);

    if (error) {
        console.error("Error seeding properties:", error);
    } else {
        console.log("✅ Seeding complete!");
    }
}

seedProperties();
