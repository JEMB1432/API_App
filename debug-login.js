// Script para debuggear el login y verificar usuarios
require("dotenv").config();
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLogin() {
    try {
        // 1. Listar todos los usuarios
        console.log("=== USUARIOS EN LA BASE DE DATOS ===");
        const { data: users, error } = await supabase
            .from("users")
            .select("id, email, role, password_hash")
            .limit(10);

        if (error) {
            console.error("Error al obtener usuarios:", error);
            return;
        }

        console.log(`Total usuarios encontrados: ${users.length}\n`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.email}`);
            console.log(`   Rol: ${user.role}`);
            console.log(`   Hash: ${user.password_hash.substring(0, 30)}...`);
            console.log("");
        });

        // 2. Verificar contraseña para un usuario específico
        const testEmail = "newUserAPI@sis.com"; // Cambia esto si es necesario
        const testPassword = "admin123";

        console.log(`\n=== VERIFICANDO CREDENCIALES ===`);
        console.log(`Email: ${testEmail}`);
        console.log(`Password: ${testPassword}\n`);

        const user = users.find(u => u.email === testEmail);

        if (!user) {
            console.log(`❌ No se encontró ningún usuario con el email: ${testEmail}`);
            console.log("\nEmails disponibles:");
            users.forEach(u => console.log(`  - ${u.email}`));
            return;
        }

        console.log(`✓ Usuario encontrado`);

        // Verificar contraseña
        const isValid = await bcrypt.compare(testPassword, user.password_hash);

        if (isValid) {
            console.log(`✅ ¡Contraseña correcta! El login debería funcionar.`);
        } else {
            console.log(`❌ Contraseña incorrecta`);
            console.log(`\nGenerando nuevo hash para '${testPassword}'...`);
            const newHash = await bcrypt.hash(testPassword, 10);
            console.log(`Nuevo hash: ${newHash}`);
            console.log(`\nEjecuta este SQL en Supabase:`);
            console.log(`UPDATE users SET password_hash = '${newHash}' WHERE email = '${testEmail}';`);
        }

    } catch (err) {
        console.error("Error:", err.message);
    }
}

debugLogin();
