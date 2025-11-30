const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("No se encuentrn las variables de entorno de Supabase.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true });
    if (error) {
      console.log(
        "Supabase connected (query result):",
        error.message || "Success"
      );
    } else {
      console.log("Conexión a Supabase exitosa.");
    }
  } catch (error) {
    console.error("Error al conectar con Supabase:", error.message);
  }
};

if (process.env.NODE_ENV === "development") {
  testSupabaseConnection();
}

module.exports = supabase;
