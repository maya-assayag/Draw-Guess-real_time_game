const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { admin } = require("../middleware/role");
const _ = require("lodash");
const express = require("express");

const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { validateUser } = require("../models/user");

const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById({ _id: req.user._id }).select("-password");
  if (user) return res.send(user);
  return res.status(404).send("The user with the given token was not found");
});

router.get("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const user = await User.findById({ _id: req.params.id }).select("-password");
  if (user) return res.send(user);
  return res.status(404).send("The user with the given ID was not found");
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(409).send("this email is already exist.");

  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    savedArticales: []
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "firstName", "lastName", "email"]));
});

router.put("/", auth, async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = await User.findOne({ email: req.body.email }).select("_id");
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

router.put("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = await User.findOne({ email: req.body.email }).select("_id");
  if (id && id !== req.params.id)
    return res.status(409).send("this email is already exist.");

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      }
    },
    { new: true }
  ).select("-password");

  if (!user)
    return res.status(404).send("The user with the given ID was not found");

  res.send(user);
});

router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id, { new: true });

  if (!user)
    return res.status(404).send("The user with the given ID was not found");

  return res.send(user);
});

module.exports = router;
//module.exports = validateUser;
