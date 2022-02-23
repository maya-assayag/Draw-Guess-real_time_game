const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth");
const { admin } = require("../middleware/role");
const express = require("express");
const { Screen } = require("../models/screen");
const { validateScreen } = require("../models/screen");

const router = express.Router();
router.use(express.json());

router.post(
  "/",
  [auth],
  asyncMiddleware(async (req, res) => {
    const { error } = validateScreen(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let screen = new Screen(req.body);

    screen = await screen.save();

    res.send(screen);
  })
);

router.get(
  "/:screenId",
  auth,
  asyncMiddleware(async (req, res) => {
    let screen;
    if (req.params.screenId) {
      screen = await Screen.findById(req.params.screenId);
      if (screen) return res.send(screen);
    }
    return res.status(404).send("The givan screen ID is not found");
  })
);

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const screens = await Screen.find();
    res.send(screens);
  })
);

router.delete("/:screenId", [auth, admin], async (req, res) => {
  const screen = await Screen.findByIdAndRemove(req.params.screenId, {
    new: true
  });

  if (!screen)
    return res.status(404).send("The screen with the given ID was not found");

  return res.send(screen);
});

router.put("/:screenId", [auth], async (req, res) => {
  const s = await Screen.findById(req.params.screenId);
  const screen = await Screen.findByIdAndUpdate(
    req.params.screenId,
    {
      $set: {
        connections: [req.body, ...s.connections],
        advertisements: req.body.advertisements
      }
    },
    { new: true }
  );

  if (!screen)
    return res.status(404).send("The screen with the given ID was not found");

  res.send(screen);
});

module.exports = router;
