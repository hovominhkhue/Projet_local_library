const express = require("express");

const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

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

//set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const DATABASE_URL="mongodb+srv://hovominhkhue:<Ilovebino.1!!>@cluster0-b7d8c.mongodb.net/local_library?retryWrites=true&w=majority";

const mongoDB = DATABASE_URL;

main().catch((err)=>console.log(err));
async function main(){
  await mongoose.connect(mongoDB);
}

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  first_name: String,
  family_name: String,
  date_of_birth: Date,
  date_of_death: Date,
  name: String,
  lifespan: String,
  url: {type: String, ref: "Book"},
});

const bookSchema = new Schema({
  title: String,
  author: {type:String, ref:"Author"},
  summary: String,
  ISBN: String,
  url: {type: String, ref: "Author"},
})

const Author = mongoose.model("Author", authorSchema);
const Book = mongoose.model("Book", bookSchema);

module.exports = app;