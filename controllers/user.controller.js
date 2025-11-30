const User = require("../models/User");

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll();

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      if (req.user && req.user.role !== "admin" && req.user.id !== id) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para ver este usuario",
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      const { password_hash, ...userData } = user;

      res.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserByEmail(req, res, next) {
    try {
      const { email } = req.params;

      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      const { password_hash, ...userData } = user;

      res.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: "Faltan campos obligatorios",
        });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado",
        });
      }

      const newUser = await User.create({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { firstName, lastName, role, isActive, password } = req.body;

      const userData = {
        firstName,
        lastName,
        role,
        isActive,
        password,
      };

      const updatedUser = await User.updateUser(id, userData);

      res.status(200).json({
        success: true,
        message: "Usuario actualizado exitosamente",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      if (req.user && req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: "No puedes eliminar tu propio usuario",
        });
      }

      await User.deleteUser(id);

      res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
