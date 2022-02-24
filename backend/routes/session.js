const asyncMiddleware = require("../middleware/async");
const express = require("express");
const { Session, validateSession } = require("../models/session");

const router = express.Router();
router.use(express.json());

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validateSession(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let session = new Advertisement(req.body);

    session = await session.save();

    res.send(session);
  })
);

router.get(
  "/:sessionId",
  asyncMiddleware(async (req, res) => {
    const session = await Session.findById({ _id: req.params.id });
    if (session) return res.send(session);
    return res.status(404).send("The session with the given ID was not found");
  })
);

router.get("/", async (req, res) => {
  const sessions = await Session.find();
  res.send(sessions);
});

router.delete("/:id", async (req, res) => {
  const session = await Session.findByIdAndRemove(req.params.id, { new: true });

  if (!session)
    return res.status(404).send("The session with the given ID was not found");

  return res.send(user);
});

router.put("/:id", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;

  const session = await Session.findByIdAndUpdate(
    id,
    {
      $set: {
        name: req.body.name,
        roundes: req.body.roundes,
        participants: req.body.participants,
        winner: req.body.winner
      }
    },
    { new: true }
  );

  if (!session)
    return res.status(404).send("The session with the given ID was not found");

  res.send(session);
});

module.exports = router;
