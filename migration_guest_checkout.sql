-- Add guest checkout columns to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_email text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_phone text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_requests text;

-- Make user_id optional (nullable) if it isn't already, for guest checkout
ALTER TABLE public.bookings ALTER COLUMN user_id DROP NOT NULL;
