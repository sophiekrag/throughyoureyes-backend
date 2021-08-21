const { Router } = require("express");
const bcrypt = require("bcryptjs");

const router = new Router();

const Child = require("../models/Child.model");
const User = require("../models/User.model");

//------Create------
router.get("/api/createchild", (req, res) => {
  res.send("Hello createchild");
});

router.post("/api/createchild", async (req, res) => {
  const {
    childData: { username, firstname, lastname, password },
  } = req.body;
  try {
    if (!username || !firstname || !lastname || !password) {
      return res.status(422).send("All fields are required");
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      return res
        .status(422)
        .send(
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
        );
    }

    const child = await Child.findOne({ username });
    if (child) {
      return res
        .status(422)
        .send(`Child already exists with username ${username}`);
    }

    const hash = await bcrypt.hash(password, 10);

    const newChild = await Child.create({
      username,
      firstname,
      lastname,
      password: hash,
    });
    await User.findByIdAndUpdate(
      { _id: req.session.user._id },
      { $push: { children: newChild._id } }
    );
    res.status(201).send("New child is created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up user. Please try again later");
  }
});

//------Login------
router.get("/api/child/login", (req, res) => {
  res.send("Hello child login");
});

router.post("/api/child/login", async (req, res) => {
  const {
    childData: { username, password },
  } = req.body;
  try {
    const child = await Child.findOne({ username });
    if (!child) {
      return res.status(404).send("No child exists with that username");
    }
    const passwordMatch = bcrypt.compareSync(password, child.password);
    if (passwordMatch) {
      req.session.child = child;
      res.status(200).json(Child);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loggin in child. Please try again later");
  }
});

//------Connect------
router.post("/api/findChild", async (req, res) => {
  const { id } = req.body;
  try {
    const child = await Child.findById({ _id: id });
    if (child) {
      await User.findByIdAndUpdate(
        { _id: req.session.user._id },
        { $push: { children: child._id } }
      );
      res.status(200).send("Succesfully connected to child");
    } else {
      return res.status(404).send("No child exists with that id");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error finding child. Please try again later");
  }
});

module.exports = router;
