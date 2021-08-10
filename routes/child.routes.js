const { Router } = require("express");
const bcrypt = require("bcryptjs");

const router = new Router();

const Child = require("../models/Child.model");
const User = require("../models/User.model");

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
    console.log(`Created new child ${newChild}`);
    res.status(201).send("New child is created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up user. Please try again later");
  }
});

module.exports = router