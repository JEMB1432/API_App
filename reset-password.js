// Script para crear un nuevo usuario administrador
require("dotenv").config();
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createNewAdmin() {
    try {
        const newAdmin = {
            email: "newUserAPI@sis.copm",
            password: "admin123",
            firstName: "Admin",
            lastName: "Sistema",
            role: "admin",
        };

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newAdmin.password, saltRounds);

        const { data, error } = await supabase
            .from("users")
            .insert([
                {
                    email: newAdmin.email,
                    password_hash: hashedPassword,
                    role: newAdmin.role,
                    first_name: newAdmin.firstName,
                    last_name: newAdmin.lastName,
                    is_active: true,
                },
            ])
            .select();

        if (error) {
            if (error.code === "23505") {
                console.error("❌ Error: Ya existe un usuario con ese email");
            } else {
                console.error("❌ Error al crear usuario:", error.message);
            }
            return;
        }

        if (data && data.length > 0) {
            console.log("✅ Usuario administrador creado exitosamente!");
            console.log("\n📋 Credenciales:");
            console.log("📧 Email:", newAdmin.email);
            console.log("🔑 Contraseña:", newAdmin.password);
            console.log("👤 Nombre:", newAdmin.firstName, newAdmin.lastName);
            console.log("🎯 Rol:", newAdmin.role);
            console.log("\n⚠️  IMPORTANTE: Cambia esta contraseña después de iniciar sesión");
            console.log("\nPuedes iniciar sesión con:");
            console.log(`POST ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`);
        }
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

createNewAdmin();
