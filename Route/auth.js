const { Router } = require("express");
const router = Router();

// for hashing and salt of password
const bcrypt = require("bcryptjs");

// session authentication
const passport = require("passport");

// importing the userSchema from model
const USERSCHEMA = require("../Model/Auth");

// =====================START of GET Method==============================

/*@HTTP GET METHOD
@ACCESS PUBLIC
@URL /auth/register
*/
router.get("/register", (req, res) => {
  res.render("../views/auth/register", {});
});

/*@HTTP GET METHOD
@ACCESS PUBLIC
@URL /auth/login
*/
router.get("/login", (req, res) => {
  res.render("../views/auth/login", {});
});

//!===================Added for authorization=======
/*@HTTP GET METHOD
@ACCESS PRIVATE
@URL /auth/logout
*/

router.get("/logout", async (req, res) => {
  req.logout();
  req.flash("SUCCESS MESSAGE", "Successfully logged out");
  res.redirect("/auth/login", 302, {});
});

//!===================Added for authorization=======

// =====================END of GET Method==============================

// =====================START of POST Method==============================
/*@HTTP POST METHOD
@ACCESS PUBLIC
@URL /auth/register
*/
router.post("/register", async (req, res) => {
  let { username, email, password, password1 } = req.body;

  // Doing the server-side validation
  let errors = [];
  if (!username) {
    errors.push({ text: " username is required" });
  }
  if (username.length < 5) {
    errors.push({ text: " username minimum must be 6 characters" });
  }
  if (!email) {
    errors.push({ text: " email is required" });
  }
  if (!password) {
    errors.push({ text: " password is required" });
  }
  if (password !== password1) {
    errors.push({ text: "password is not matching" });
  }

  if (errors.length > 0) {
    res.render("../views/auth/register", {
      errors,
      username,
      email,
      password,
      password1,
    });
  } else {
    let user = await USERSCHEMA.findOne({ email });
    if (user) {
      req.flash(
        "ERROR_MESSAGE",
        "Email already exists please add new email address"
      );
      res.redirect("/auth/register", 302, {});
    } else {
      // to store in database
      let newUser = new USERSCHEMA({
        username,
        email,
        password,
      });

      // ============to hash the password=================
      // alogorithm: 12 or 10

      bcrypt.genSalt(12, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          // adding the hashed password to the DB
          await newUser.save();
          req.flash("SUCCESS_MESSAGE", "Successfully Registered");
          res.redirect("/auth/login", 302, {});
        });
      });

      // ============to hash the password=================
    }
  }
});

/*@HTTP POST METHOD
@ACCESS PUBLIC
@URL /auth/login
*/

// Session Authentication
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/employee/emp-profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
});

// =====================END of POST Method==============================

module.exports = router;
