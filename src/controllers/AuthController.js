require("dotenv/config");

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { promisify } = require("util");
const { sendPasswordCode } = require("../lib/mailing");
const TIME = require("../lib/time");

const unlinkAsync = promisify(fs.unlink);

const register = async (req, res, next) => {
  const hashedPass = await bcrypt.hash(req.body.password, 10);

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
              notificationToken
                ? {
                    _id: user._id,
                    notificationToken: notificationToken,
                  }
                : { _id: user._id },
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

const addToken = async (req, res, next) => {
  const { _id, notificationToken } = req.user;
  let token = notificationToken || req.body.token;
  try {
    await User.updateOne({ _id }, { $addToSet: { notificationTokens: token } });
    res.json();
    next();
  } catch (err) {
    res.status(501).json({ status: "error", message: err });
  }
};

const removeToken = async (req, res, next) => {
  const { _id, notificationToken } = req.user;
  let token = notificationToken || req.body.token;
  try {
    await User.updateOne({ _id }, { $pull: { notificationTokens: token } });
    res.json();
    next();
  } catch (err) {
    res.status(501).json({ status: "error", message: err });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const code = Math.floor(100000 + Math.random() * 900000);
    const { email } = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: { resetCode: `${code}` },
      },
      { new: true, useFindAndModify: false }
    );

    if (email) {
      setTimeout(() => {
        User.updateOne(
          { email: req.body.email },
          { $set: { resetCode: null } }
        );
      }, 1 * TIME.MINUTE);

      sendPasswordCode(email, code);
    }

    res.json();
  } catch (err) {
    res.status(404).json();
  }
  next();
};

const checkPasswordCode = async (req, res, next) => {
  const { email, code } = req.body;

  try {
    const { resetCode } = await User.findOne({ email });
    if (code == resetCode) res.json({ message: "Valid code!" });
    else res.status(404).json({ message: "Invalid code!" });

    next();
  } catch (_) {
    console.log(_);
    res.status(401).json({ message: "Invalid code!" });
  }
};

const resetPassword = async (req, res, next) => {
  const { email, code, password } = req.body;
  try {
    const { resetCode } = await User.findOne({ email });
    if (code === resetCode) {
      const hashedPass = await bcrypt.hash(password, 10);
      if (hashedPass) {
        const updated = await User.updateOne(
          { email },
          {
            password: hashedPass,
            resetCode: null,
          }
        );
        res.json(updated);
      } else res.status(501).json("Error hashing password");
    } else res.status(401).json({ message: "Invalid code!" });
  } catch (_) {
    res.status(401).json({ message: "Invalid code!" });
  }
};

module.exports = {
  register,
  login,
  logout,
  addToken,
  removeToken,
  forgotPassword,
  checkPasswordCode,
  resetPassword,
};
