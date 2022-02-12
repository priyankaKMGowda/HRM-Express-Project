const express = require("express");

// load the env file
const { PORT, MONGODB_URL } = require("./config");

const { connect } = require("mongoose");
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash"); //used for snack bar msg
const session = require("express-session"); //used for snack bar msg
const passport = require("passport"); // used for Session Authentication

// Calling the passport.js from the Middleware
require("./middlewares/passport")(passport);

// importing the built in middleware
const { join } = require("path");

// Importing all routing module
const EmployeeRoute = require("./Route/employee");
const AuthRoute = require("./Route/auth");

const app = express();

//!------------------connecting to database STARTS ----------------------
let DatabaseConnection = async () => {
  await connect(MONGODB_URL);
  console.log("Database connected successfully....");
};
DatabaseConnection();
//!------------------connecting to database ENDS ----------------------

//? *******************template Engine Middleware STARTS***********************/
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
//? *******************template Engine Middleware ENDS***********************/

//************************Built In Middleware STARTS*************
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "node_modules"))); //for bootstrap

// using post method request need to parse url
app.use(express.urlencoded({ extended: true })); //for post method

// used for PUT and DELETE Method Request
app.use(methodOverride("_method"));

// session middleware i.e from express-session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// its for session authentication.(Need to be called along with express-session)
app.use(passport.initialize());
app.use(passport.session()); //will handle session management

// connecting to flash middleware, now set the global variables below
app.use(flash());

//************************Built In Middleware ENDS*************

//=======================HANDLEBARS HELPER CLASSES===============

Handlebars.registerHelper("trimFirst6Char", function (passedString) {
  var theString = passedString.slice(6);
  return new Handlebars.SafeString(theString);
});

// --------------------Adding the register helper classes for authorization------------------
Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

//=======================HANDLEBARS HELPER CLASSES===============

// ================To set Global Middleware================================

app.use(function (req, res, next) {
  app.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  app.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  app.locals.errors = req.flash("errors"); //server side validation
  app.locals.error = req.flash("error"); // Session authentication

  res.locals.user = req.user || null;
  let userData = req.user || null;
  res.locals.finalData = Object.create(userData);
  res.locals.username = res.locals.finalData.username;

  next();
});

// ================To set Global Middleware================================

//!------------------Using Other Route Middlewares STARTS --------------------
// here  '/employee' is a static path
//the syntax is app.use(path,middleware)
app.use("/employee", EmployeeRoute);
app.use("/auth", AuthRoute);

//!------------------Using Other Middlewares ENDS --------------------

// listening to port
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`App is Running on port ${PORT}`);
});
