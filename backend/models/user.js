const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const { advertisementSchema } = require("../models/advertisement");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 10,
    maxlength: 255,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  role: {
    type: String,
    enum: ["Anonymous", "Client", "Admin"],
    default: "Anonymous",
    required: true
  },
  advertisements: { type: [advertisementSchema] }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .min(2)
      .max(50),
    lastName: Joi.string()
      .required()
      .min(2)
      .max(50),
    email: Joi.string()
      .required()
      .min(10)
      .max(255)
      .lowercase()
      .email(),
    password: Joi.string()
      .required()
      .min(8)
      .max(32)
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&{}:;<>,.?~_+-]).{8,32}$/
      ),
    role: Joi.string()
      .required()
      .valid(...Object.values(["Anonymous", "Client", "Admin"]))
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
