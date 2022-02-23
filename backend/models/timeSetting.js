const mongoose = require("mongoose");

const timeSettingSchema = new mongoose.Schema({
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  daysOfTheWeek: {
    type: [String],
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    required: true
  }
});

const TimeSetting = mongoose.model("TimeSetting", timeSettingSchema);

module.exports = { TimeSetting, timeSettingSchema };
