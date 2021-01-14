const express = require("express");

require("./database/mongoose");

const UserRoutes = require("./routes/user");
const ImageRoutes = require("./routes/images");
const RateLimiter = require("./middleware/limiter");
const app = express();

app.use(RateLimiter);
app.use(express.json());
app.use(UserRoutes);
app.use(ImageRoutes);

module.exports = app;
