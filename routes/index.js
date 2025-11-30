const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const userRoutes = require("./user");
const measurementRoutes = require("./measurement");


router.use("/", authRoutes);
router.use("/", userRoutes);
router.use("/", measurementRoutes);

// Ruta de documentación de la API
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API del Decibelímetro Ambiental",
        version: "1.0.0",
        endpoints: {
            auth: {
                "POST /login": "Iniciar sesión y obtener token JWT (requiere email y password)",
                "POST /register": "Registrar nuevo usuario (público - no requiere auth)",
            },
            users: {
                "GET /user": "Obtener todos los usuarios (Requiere Auth)",
                "GET /user/:id": "Obtener usuario por ID (Requiere Auth)",
                "GET /user/email/:email": "Obtener usuario por Email (Requiere Auth)",
                "POST /user": "Crear nuevo usuario (Requiere Auth)",
                "PUT /user/:id": "Actualizar usuario (Requiere Auth)",
                "DELETE /user/:id": "Eliminar usuario (Requiere Auth)",
            },
            history: {
                "POST /history": "Guardar nueva medición de decibelios (Requiere Auth)",
                "GET /history": "Obtener historial de mediciones del usuario actual (Requiere Auth)",
                "GET /history/all": "Obtener todas las mediciones (Solo Admin) (Requiere Auth)",
            },
        },
    });
});

module.exports = router;
