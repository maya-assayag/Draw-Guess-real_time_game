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
  score: { type: Number, minlength: 0, required: true },
  participants: [{ type: mongoose.Types.ObjectId, ref: "User" }]
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
    score: Joi.number()
      .required()
      .min(0),
    //participants: Joi.array().items({ _id: Joi.objectId() }),
    participants: Joi.array()
  });

  return schema.validate(session);
}

module.exports = { Session, validateSession, sessionSchema };
