const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth");
const addAdvertisementToScreens = require("../services/addAdToScreens");
const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Advertisement } = require("../models/advertisement");
const { validateAdvertisement } = require("../models/advertisement");

const router = express.Router();
router.use(express.json());

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validateAdvertisement(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!mongoose.Types.ObjectId.isValid(req.user._id))
      return res.status(400).send("Invalid user ID.");

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).send("this user does not exist.");

    advertisement = new Advertisement(req.body);

    advertisement = await advertisement.save();

    user.advertisements.push(advertisement);

    await user.save();

    await addAdvertisementToScreens(advertisement);

    res.send(advertisement);
  })
);

router.get(
  "/:advertisementId",
  auth,
  asyncMiddleware(async (req, res) => {
    let advertisement;
    const user = await User.findById(req.user._id);
    if (user && req.params.advertisementId && user.advertisements) {
      advertisement = user.advertisements.find(
        advertisement => advertisement._id == req.params.advertisementId
      );
    }
    return advertisement
      ? res.send(advertisement)
      : user && user.advertisements
      ? res.status(404).send("The givan application ID is not found")
      : res.status(404).send("This user not exist or no has applications");
  })
);

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    let advertisement;
    const user = await User.findById(req.user._id);
    if (user && user.advertisements) {
      return res.send(user.advertisements);
    }
    res.status(404).send("This user not exist or no has applications");
  })
);

router.delete(
  "/:advertisementId",
  auth,
  asyncMiddleware(async (req, res) => {
    let advertisement = await Advertisement.findByIdAndRemove(
      req.params.advertisementId,
      { new: true }
    );

    if (!advertisement)
      return res
        .status(404)
        .send("The advertisement with the given ID was not found");

    const user = await User.findById(req.user._id);
    advertisement = user.advertisements.id(req.params.advertisementId);
    advertisement.remove();
    await user.save();
    res.send(advertisement);
  })
);

router.put(
  "/:advertisementId",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).send("This user not exist");

    let advertisement;

    if (user.advertisements) {
      advertisement = user.advertisements.find(
        advertisement => advertisement._id == req.params.advertisementId
      );
      if (advertisement) {
        advertisement.topic = req.body.topic;
        advertisement.title = req.body.title;
        advertisement.description = req.body.description;
        advertisement.images = req.body.images;
        advertisement.source = req.body.source;
        advertisement.screenTime = req.body.screenTime;
        advertisement.timeSettings = req.body.timeSettings;
        advertisement.templates = req.body.templates;
        advertisement.related = req.body.related;
        advertisement.screens = req.body.screens;
      }
      await user.save();
      res.send(advertisement);
    } else {
      res.status(404).send("This user has no advertisements");
    }
  })
);

module.exports = router;
