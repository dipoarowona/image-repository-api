const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 5,
});

module.exports = limiter;
