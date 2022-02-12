module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("ERROR MESSAGE", "You are not an  Authorized user");

    res.redirect("/auth/login", 302, {});
  },
};
