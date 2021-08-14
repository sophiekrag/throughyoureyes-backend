const { Router } = require("express");

const router = new Router();

//const Child = require("../models/Child.model");
const User = require("../models/User.model");

//------Get my children------
router.get("/api/myChildren", async (req, res) => {
  try {
    const result = await User.findById(req.session.user._id).populate(
      "children"
    );
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting data. Please try again later");
  }
});

module.exports = router;