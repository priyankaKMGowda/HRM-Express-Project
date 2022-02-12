const localStrategy = require("passport-local").Strategy;
const { compare } = require("bcryptjs");
const USERSCHEMA = require("../Model/Auth");

// passport-local documentation for below steps
module.exports = passport => {
  passport.use(
    new localStrategy(
      //! the local strategy has  2 fields: {}, callback
      { usernameField: "email" },

      async (email, password, done) => {
        // ================To Check Email exists or Not=============
        let user = await USERSCHEMA.findOne({ email }); //email: email

        //================To Check User exists or Not=============
        if (!user) {
          // doing the error handling, done is like the error, null is errhandling
          done(null, false, { message: "user not exists" });
        }

        //================To Match the Password ====================
        // compare(password parameter, db password,callback)
        compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            done(null, false, { message: "Password doesn't match" });
          } else {
            done(null, user);
          }
        });
      }
    )
  );

  // ===================Adding Serialize and deserialize===================

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    USERSCHEMA.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // ===================Adding Serialize and deserialize===================

  //!-------------------- END OF AUTHENTICATION---------------------
};
