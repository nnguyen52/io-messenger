const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { json, urlencoded } = express;
const mongoose = require("mongoose");
// schema
const User = require("./db/User");

const app = express();

app.use(
  cors({
    origin: `${process.env.BASE_URL}`,
    credentials: true,
  })
);
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
// mongo
const mongoUrl = `${`mongodb+srv://jerry_canvasIO:${process.env.DB_PW}@cluster0.9tckmt7.mongodb.net/?retryWrites=true&w=majority`}`;
const connectMongo = async (url) => {
  try {
    await mongoose.connect(url ? url : mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
const connectDB = async () => {
  await connectMongo();
};
connectDB();

app.use(function (req, res, next) {
  // checking if token in request header exist
  const token = req.headers["x-access-token"];
  //   return next();
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, async (err, decoded) => {
      if (err) {
        // if error -> user will be empty
        return next();
      }
      await User.findOne({ _id: decoded.id.toString() }).then((user) => {
        // attach user to request
        req.user = user;
        return next();
      });
    });
  } else {
    // if token not found -> user will be empty
    console.log("___NOT found token, next");
    return next();
  }
});
// use routes here
app.get("/", (req, res) => {
  res.json({ message: "Server is running." });
});
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));
// ........................

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = { app, connectDB, mongoUrl };
