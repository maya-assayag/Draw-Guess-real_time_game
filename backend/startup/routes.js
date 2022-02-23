const express = require("express");
const helmet = require("helmet");
const advertisement = require("../routes/advertisement");
const screen = require("../routes/screen");
//const admin = require("../routes/admin");
const home = require("../routes/home");
const user = require("../routes/user");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const cors = require("cors");

module.exports = function(app) {
  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use("/api/user", user);
  app.use("/api/advertisement", advertisement);
  app.use("/api/screen", screen);
  //app.use("/api/admin", admin);
  app.use("/api/auth", auth);
  app.use("/", home);
  app.use(error);
};
