const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos",
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      const isPasswordValid = await User.comparePassword(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: "Usuario desactivado",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || "8h",
        }
      );

      await User.updateLastLogin(user.id);

      res.status(200).json({
        success: true,
        message: "Login exitoso",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
