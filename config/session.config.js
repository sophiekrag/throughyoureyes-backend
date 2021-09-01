const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      key: process.env.KEY,
      proxy: process.env.PROXY,
      saveUninitialized: true,
      cookie:{
        secure: process.env.SECURE,
        sameSite: process.env.SAMESITE,
        httpOnly: false,
        maxAge: 60000000, 
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 24,
      }),
    })
  );
};