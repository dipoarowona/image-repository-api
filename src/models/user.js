const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 8,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//virtual relationship to images
UserSchema.virtual("images", {
  ref: "Image",
  localField: "_id",
  foreignField: "owner",
});

//generate auth token
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//hash password before saveing
UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//remove hashed pw and tokens
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.tokens;
  delete userObject.password;
  return userObject;
};

//search for user based on name and pw
UserSchema.statics.findByCredentials = async function (name, password) {
  const user = await User.findOne({ name });

  if (!user) {
    throw new Error("login error!");
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("login error!");
  }
  return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
