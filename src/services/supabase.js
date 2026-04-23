import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vbpbbweneyrxoymdumfe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZicGJid2VuZXlyeG95bWR1bWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjM4NTcsImV4cCI6MjA5MTMzOTg1N30.Qeh55YyDQ10RfagV5l7hFCQOd5xmgAd-ERojBjR62R4'

export const supabase = createClient(supabaseUrl, supabaseKey)
