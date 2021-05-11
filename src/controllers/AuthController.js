require("dotenv/config");

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

const register = async (req, res, next) => {
  const hashedPass = await bcrypt.hash(req.body.password, 10);
  console.log(hashedPass);
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass,
    phone: req.body.phone,
    avatar: req.file ? req.file.path : null,
  });

  user
    .save()
    .then((_) => res.json({ message: "User Added Successfully!" }))
    .catch(async (err) => {
      if (req.file) await unlinkAsync(req.file.path);
      switch (err.code) {
        case 11000: //Duplicate
          return res.status(400).json({
            status: "error",
            error: "Username or Email already exist",
          });
        default:
          return res
            .status(500)
            .json({ status: "error", message: err.message });
      }
    });
};

const login = (req, res, next) => {
  const { username, password, notificationToken } = req.body;

  function error() {
    res.status(401).json({
      status: "error",
      message: "Username or Password incorrect!",
    });
  }

  User.findOne({ $or: [{ email: username }, { username: username }] })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then(async (correct) => {
          if (correct) {
            let token = jwt.sign(
              {
                _id: user._id,
                notificationToken: notificationToken,
              },
              process.env.JWT_TOKEN_KEY,
              process.env.LOGIN_EXPIRE_TIME
                ? { expiresIn: process.env.LOGIN_EXPIRE_TIME }
                : null
            );

            if (notificationToken) {
              //Save notification token
              await User.updateOne(
                { _id: user._id },
                { $push: { notificationTokens: notificationToken } }
              );
            }

            res.json({
              message: "Login successful!",
              userId: user.id,
              //expiresOn: new Date(Date.now() + 60*60*1000),
              token,
            });
          } else error();
        })
        .catch(error);
    })
    .catch(error);
};

const logout = async (req, res, next) => {
  const { _id, notificationToken } = req.user;
  if (notificationToken) {
    await User.updateOne(
      { _id },
      { $pull: { notificationTokens: notificationToken } },
      { safe: true }
    );
  }

  res.json();
  next();
};

module.exports = {
  register,
  login,
  logout,
};
