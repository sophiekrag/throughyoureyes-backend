const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken") ;

const router = new Router();

const User = require("../models/User.model");

//------Signup------
router.get("/api/signup", (req, res) => {
  res.send("Hello");
});

router.post("/api/signup", async (req, res) => {
  const { userData: { username, email, password },} = req.body;
  try {
    if (!username || !email || !password) {
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

    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`User already exists with email ${email}`);
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hash,
    });
    console.log(`Created new user ${newUser}`);
    const token = jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET, {
      expiresIn: "100d"
    })
    res.status(201).json(token)
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up user. Please try again later");
  }
});

//------Login------
router.get("/api/login", (req, res) => {
  res.send("Hello login");
});

router.post("/api/login", async (req, res) => {
  const { userData: { email, password },} = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("No user exists with that email");
    }
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: "100d"
      })
      res.status(200).json(token)
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loggin in user. Please try again later");
  }
});

module.exports = router;
