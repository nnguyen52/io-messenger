const router = require("express").Router();
const User = require("../../db/User");
const jwt = require("jsonwebtoken");
const { users } = require("../../socketServer");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

router.post("/register", async (req, res, next) => {
  try {
    // expects {username, email, password} in req.body
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({
        error: "Username, password, and email required",
        type: "Authentication",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
        type: "Authentication",
      });
    }

    // check if email exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error:
          "This email is already registered. Please login or use another email!",
        type: "Authentication",
      });
    }

    const user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.SESSION_SECRET,
      //   12 hours
      { expiresIn: 86400 * 12 }
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log("___register error: ", error);
    // if (error.name === "SequelizeUniqueConstraintError") {
    //   return res.status(401).json({ error: "User already exists" });
    // } else if (error.name === "SequelizeValidationError") {
    //   return res.status(401).json({ error: "Validation error" });
    // } else next(error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // expects username and password in req.body
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });

    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      console.log({ error: `No user found for username: ${username}` });
      res.status(401).json({ error: "Wrong username and/or password" });
    } else if (user.password != password) {
      console.log({ error: "Wrong username and/or password" });
      res.status(401).json({ error: "Wrong username and/or password" });
    } else {
      const token = jwt.sign(
        { id: user._id },
        process.env.SESSION_SECRET,
        // expire in 1 hour
        { expiresIn: 86400 * 12 }
      );
      // console.log({ user });
      res.json({
        user: {
          ...user._doc,
          password: null,
        },
        token,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/user", (req, res, next) => {
  if (req.user) return res.json(req.user);
  else return res.json({});
});

router.post("/updatePhotoUrl", async (req, res) => {
  const user = await User.findOne({ _id: req.user._id.toString() });
  // delete current cloudinary avatar
  if (user.photoUrl != process.env.defaultPhotoUrl)
    await cloudinary.uploader.destroy(user.photoUrl);
  await User.findOneAndUpdate(
    { _id: req.user._id.toString() },
    {
      photoUrl: req.body.newPhotoUrl,
    }
  );
  res.status(200).json({ message: "Update avatar successfully!" });
});

router.post("/updateUsername", async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      username: req.body.username,
    }
  );
});
router.post("/updatePassword", async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      password: req.body.password,
    }
  );
});

router.get("/userDetail/:id", async (req, res) => {
  if (!req.user._id)
    return res.status(400).json({ message: "Authorization error." });
  const user = await User.findOne({ _id: req.params.id.toString() });
  return res.status(200).json({ user });
});

router.get("/onlineUsers", (req, res) => {
  return res.status(200).json(users);
});
router.delete("/logout", (req, res, next) => {
  res.sendStatus(204);
});

module.exports = router;
