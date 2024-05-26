const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middleware
app.use(logger);

// View Engine
app.set("view engine", "ejs");

// Database Connection
mongoose
  .connect(config.dbUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api", require("./routes/api"));
app.use("/", require("./routes/view"));

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
