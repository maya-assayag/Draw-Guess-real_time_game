const express = require("express");
const helmet = require("helmet");
const session = require("../routes/session");
const user = require("../routes/user");
const error = require("../middleware/error");
const cors = require("cors");

module.exports = function(app) {
  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use("/api/user", user);
  app.use("/api/session", session);
  app.use(error);
};
