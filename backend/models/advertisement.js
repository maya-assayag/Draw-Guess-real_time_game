const mongoose = require("mongoose");
const { timeSettingSchema } = require("./timeSetting");
const { screenSchema } = require("./screen");
const { Screen } = require("./screen");
const Joi = require("joi");

const advertisementSchema = new mongoose.Schema({
  topic: {
    type: String,
    minlength: 1,
    maxlength: 25
  },
  title: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 255
  },
  link: {
    type: String
  },
  images: [String],
  source: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: true
  },
  screenTime: {
    type: Number,
    required: true
  },
  timeSettings: {
    type: [timeSettingSchema]
  },
  templates: {
    type: [String],
    required: true
  },
  related: [String],
  screens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen"
    }
  ]
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

function validateAdvertisement(advertisement) {
  const schema = Joi.object({
    topic: Joi.string()
      .required()
      .min(1)
      .max(25),
    title: Joi.string()
      .required()
      .min(1)
      .max(225),
    description: Joi.string().required(),
    link: Joi.string().required(),
    images: Joi.array(),
    source: Joi.string()
      .required()
      .min(1)
      .max(225),
    screenTime: Joi.number(),
    timeSettings: Joi.array(),
    related: Joi.array(),
    templates: Joi.array(),
    screens: Joi.array()
  });

  return schema.validate(advertisement);
}

module.exports = { Advertisement, validateAdvertisement, advertisementSchema };
