import { createClient } from  '@supabase/supabase-js';

const supabaseUrl = 'https://itqfvmyzmbcsfqwxhknk.supabase.co/rest/v1/ ';
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cWZ2bXl6bWJjc2Zxd3hoa25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjgzNzIsImV4cCI6MjA5NTE0NDM3Mn0.wItieQ2oSjwprkYtLncZyrk5rRHNqLUl0N2l2AlWHkQ ';
export const supabase = createClient(supabaseUrl, supabaseKey);