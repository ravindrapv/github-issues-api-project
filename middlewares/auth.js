const jwt = require("jsonwebtoken");
const passport = require("passport");
const verifyTokenAndRole = (roles) => (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      console.log("Error decoding token:", err);
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }

    if (!user || !roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Insufficient role privileges" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = verifyTokenAndRole;
