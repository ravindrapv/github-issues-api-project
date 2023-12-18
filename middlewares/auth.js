const jwt = require("jsonwebtoken");

const verifyToken = () => (req, res, next) => {
  console.log("Headers:", req.headers);

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Unauthorized: Token missing" });
  }

  jwt.verify(token.split(" ")[1], "your_secret_key", (err, user) => {
    if (err) {
      console.log("Error decoding token:", err);
      return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
