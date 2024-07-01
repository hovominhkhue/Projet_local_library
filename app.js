const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const compression = require("compression");
const helmet = require("helmet");

//router
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// add router
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

require('dotenv').config();

//set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

//create file .env
//MONGODB_URI = "mongodb+srv://hovominhkhue:motdepasse@cluster0.89wkobs.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI;

main().catch((err)=>console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
}

module.exports = app;