// Script para generar el hash correcto de la contraseña
const bcrypt = require("bcrypt");

async function generateHash() {
    const password = "admin123";
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

    console.log("Contraseña:", password);
    console.log("Hash generado:", hash);
    console.log("\nEjecuta este SQL en Supabase:");
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'api_APP@sistema.com';`);
}

generateHash();
