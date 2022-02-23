const { Screen } = require("../models/screen");

async function addAdvertisementToScreens(advertisement) {
  let adsSet;
  let screen;
  for (let screenId of advertisement.screens) {
    screen = await Screen.findById(screenId.toString());
    if (screen) {
      adsSet = new Set(screen.advertisements);
      adsSet.add(advertisement);
      screen.advertisements = Array.from(adsSet);
      await screen.save();
    }
  }
}

module.exports = addAdvertisementToScreens;
