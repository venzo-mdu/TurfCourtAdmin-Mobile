import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'

const supabaseUrl = 'https://plcgbisdcpfcvecpvtww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsY2diaXNkY3BmY3ZlY3B2dHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyNDA4NDAsImV4cCI6MjAxNjgxNjg0MH0.6dAiOUaEm5ezwxIPSDcCOYknQmqPlvRKZMquu8KooYs';

export const SUPABASE_CLIENT = createClient(supabaseUrl, supabaseKey)