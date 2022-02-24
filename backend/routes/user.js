const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const { User, validateUser } = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/:id", [validateObjectId], async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (user) return res.send(user);
  return res.status(404).send("The user with the given ID was not found");
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.send(user);

  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    sessions: []
  });

  user = await user.save();
  res.send(user);
});

router.put("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = await User.findOne({ username: req.body.username }).select("_id");
  if (id && id !== req.user._id)
    return res.status(409).send("this email is already exist.");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      }
    },
    { new: true }
  ).select("-password");
  res.send(user);
});

router.put("/:id", [validateObjectId], async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = await User.findOne({ username: req.body.username }).select("_id");

  const user = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        sessions: req.body.sessions
      }
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found");

  res.send(user);
});

router.delete("/:id", [validateObjectId], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id, { new: true });

  if (!user)
    return res.status(404).send("The user with the given ID was not found");

  return res.send(user);
});

module.exports = router;
