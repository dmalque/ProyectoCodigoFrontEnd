import { createClient } from "@supabase/supabase-js"
const supabaseUrl = "https://jjzrbzwsewlukufvgozx.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqenJiendzZXdsdWt1ZnZnb3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3OTM5MjAsImV4cCI6MjA3NzM2OTkyMH0.Q-0GW9SK3o98KMTV-y7wsVeqNPCauDtmVwpDh2yr1wY"
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
