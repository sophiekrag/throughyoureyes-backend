require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookieparser")

const app = express();

//setup db
require("./config/db.config");
require("./config/session.config")(app);

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_POINT,
    credentials: true
  })
);

app.use("/", require("./routes/auth.routes"));
app.use("/", require("./routes/child.routes"));
app.use("/", require("./routes/user.routes"));

app.listen(
  process.env.PORT,
  console.log(`Server running on port ${process.env.PORT}`)
);
