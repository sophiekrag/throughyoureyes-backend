const session = require("express-session");
const MongoStore = require("connect-mongo");
console.log(process.env.NODE_ENV)
const isProduction = process.env.NODE_ENV === "production" ? {
  key: "connect.sid",
  proxy: true,
} : {}

const isProduction2 = process.env.NODE_ENV === "production" ? {
   secure: true,
   sameSite: "none",
} : { }

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      ...isProduction,
      saveUninitialized: true,
      cookie:{
       ...isProduction2,
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