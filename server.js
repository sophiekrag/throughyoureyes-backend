require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

//setup db
require("./config/db.config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", require("./routes/auth.routes"));
app.use("/", require("./routes/child.routes"));

app.listen(
  process.env.PORT,
  console.log(`Server running on port ${process.env.PORT}`)
);
