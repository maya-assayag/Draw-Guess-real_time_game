const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const sessionSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 0,
    maxlength: 25
  },
  roundes: {
    type: Number,
    minlength: 0,
    maxlength: 255,
    required: true
  },
  participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  winner: { type: mongoose.Types.ObjectId, ref: "User" }
});

const Session = mongoose.model("Session", sessionSchema);

function validateSession(session) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(0)
      .max(25),
    roundes: Joi.number()
      .required()
      .min(0)
      .max(225),
    //participants: Joi.array().items({ _id: Joi.objectId() }),
    participants: Joi.array(),
    winner: Joi.string()
  });

  return schema.validate(session);
}

module.exports = { Session, validateSession, sessionSchema };
