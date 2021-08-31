const { Router } = require("express");
const bcrypt = require("bcryptjs");

const router = new Router();

const Child = require("../models/Child.model");
const User = require("../models/User.model");

//------Create------
router.post("/api/createchild", async (req, res) => {
  const {
    childData: { username, firstname, lastname, password },
  } = req.body;
  try {
    if (!username || !firstname || !lastname || !password) {
      return res.status(422).json({ message: "All fields are required" });
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      return res
        .status(422)
        .json({
          message:
            "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
        });
    }

    const child = await Child.findOne({ username });
    if (child) {
      return res
        .status(422)
        .json({message: `Child already exists with username ${username}`});
    }

    const hash = await bcrypt.hash(password, 10);

    const newChild = await Child.create({
      username,
      firstname,
      lastname,
      password: hash,
      creator: req.session.user,
    });
    await User.findByIdAndUpdate(
      { _id: req.session.user._id },
      { $push: { children: newChild._id } }
    );
    res.status(200).json({message: "New child is created"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Error signing up user. Please try again later"});
  }
});

//------Login------
router.post("/api/child/login", async (req, res) => {
  const {
    childData: { username, password },
  } = req.body;
  try {
    const child = await Child.findOne({ username });
    if (!child) {
      return res.status(404).json({message: "No child exists with that username"});
    }
    const passwordMatch = bcrypt.compareSync(password, child.password);
    if (passwordMatch) {
      req.session.child = child;
      res.status(200).json(child);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Error loggin in child. Please try again later"});
  }
});

//------Connect------
router.post("/api/findChild", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById({ _id: req.session.user._id });
    const child = await Child.findById({ _id: id });
    if (user.children.includes(child._id)) {
      res.status(300).json({ message: "Already connected to child" });
    } else if (child) {
      await User.findByIdAndUpdate(
        { _id: req.session.user._id },
        { $push: { children: child._id } }
      );
      res.status(200).json({message: "Succesfully connected to child"});
    } else {
      return res.status(404).json({message: "No child exists with that id"});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Error finding child. Please try again later"});
  }
});

//------Get child------
router.get("/api/getChild/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Child.findById({ _id: id }).populate("stories");
    res.status(200).json(child);
  } catch (error) {
    res.status(500).json({message: "Error finding child. Please try again later"});
  }
});

module.exports = router;
