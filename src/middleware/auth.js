const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const id = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ error: "invalid credentials" });
  }
};

module.exports = auth;
