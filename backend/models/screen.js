const mongoose = require("mongoose");
const { advertisementSchema } = require("../models/advertisement");
const Joi = require("joi");

const screenSchema = new mongoose.Schema({
  connections: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      userFirstName: String,
      userLastName: String,
      connectTime: String,
      leaveTime: String
    }
  ],
  advertisements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertisement"
    }
  ]
});

const Screen = mongoose.model("Screen", screenSchema);

function validateScreen(screen) {
  const schema = Joi.object({
    connections: Joi.array(),
    advertisements: Joi.array()
  });

  return schema.validate(screen);
}

module.exports = { Screen, validateScreen, screenSchema };
