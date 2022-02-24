const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 0,
    maxlength: 25
  },
  lastName: {
    type: String,
    minlength: 0,
    maxlength: 25
  },
  username: {
    type: String,
    lowercase: true,
    required: true,
    minlength: 1,
    maxlength: 25
  },
  sessions: [{ score: {}, type: mongoose.Types.ObjectId, ref: "Session" }]
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
      .min(0)
      .max(25),
    lastName: Joi.string()
      .required()
      .min(0)
      .max(25),
    username: Joi.string()
      .required()
      .min(1)
      .max(25),
    sessions: Joi.array().items({ _id: Joi.objectId() })
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
