import { createClient } from '@supabase/supabase-js';

// Usamos las credenciales directas para evitar fallos de lectura de variables
const supabaseUrl = 'https://itqfvmyzmbcsfqwxhknk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cWZ2bXl6bWJjc2Zxd3hoa25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjgzNzIsImV4cCI6MjA5NTE0NDM3Mn0.wItieQ2oSjwprkYtLncZyrk5rRHNqLUl0N2l2AlWHkQ';

// Esta validación evita el error de "Multiple GoTrueClient instances"
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan las credenciales de Supabase. Revisa tu archivo de configuración.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);