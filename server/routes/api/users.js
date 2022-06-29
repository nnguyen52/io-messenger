const router = require("express").Router();
const User = require("../../db/User");

// search
router.post("/:username", (req, res) => {
  // console.log("/:username_input", req.body);
  res.json({});
});

module.exports = router;
