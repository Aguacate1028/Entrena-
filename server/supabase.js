import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validación de seguridad
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Faltan variables de entorno SUPABASE_URL o SUPABASE_KEY");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function testConnection() {
  try {
    const { data, error } = await supabase.from("usuarios").select("*").limit(1);
    if (error) throw error;
    console.log("✅ Conectado a Supabase correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
    return false;
  }
}