const Measurement = require("../models/Measurement");

class MeasurementController {
  async createMeasurement(req, res, next) {
    try {
      const { decibels, latitude, longitude, locationName } = req.body;

      if (decibels === undefined || decibels === null) {
        return res.status(400).json({
          success: false,
          message: "El campo 'decibels' es requerido",
        });
      }

      if (typeof decibels !== "number" || decibels < 0) {
        return res.status(400).json({
          success: false,
          message: "El campo 'decibels' debe ser un número positivo",
        });
      }

      const measurementData = {
        userId: req.user.id,
        decibels,
        latitude: latitude || null,
        longitude: longitude || null,
        locationName: locationName || null,
      };

      const measurement = await Measurement.create(measurementData);

      res.status(201).json({
        success: true,
        message: "Medición guardada exitosamente",
        data: measurement,
      });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 100;

      const measurements = await Measurement.findByUserId(userId, limit);

      res.status(200).json({
        success: true,
        count: measurements.length,
        data: measurements,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllHistory(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para ver todas las mediciones",
        });
      }

      const limit = parseInt(req.query.limit) || 100;
      const measurements = await Measurement.findAll(limit);

      res.status(200).json({
        success: true,
        count: measurements.length,
        data: measurements,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MeasurementController();
