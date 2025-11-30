const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const measurementRoutes = require('./routes/measurement');

const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);

app.use(authMiddleware);

app.use('/', userRoutes);
app.use('/', measurementRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Servidor iniciado en: " + PORT)
});