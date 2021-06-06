const User = require("../models/User");
const bcrypt = require("bcryptjs");

const fs = require("fs");
const { promisify } = require("util");
const { HttpCodes } = require("../../requestErrors");

const compare = promisify(bcrypt.compare);

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
};

const getUser = async (req, res, done) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id, {
      notificationTokens: false,
      password: false,
      bikes: false,
      __v: false,
      createdAt: false,
      updatedAt: false,
    });
    if (user) res.json(user);
    else res.status(HttpCodes.NotFound).json({ message: "user not found" });
    done();
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const update = async (req, res, done) => {
  //Doesn't change Password
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);

    const updated = await User.updateOne(
      { _id: _id },
      {
        $set: {
          username:
            req.body.username != null ? req.body.username : user.username,
          email: req.body.email != null ? req.body.email : user.email,
          phone: req.body.phone != null ? req.body.phone : user.phone,
          avatar: req.file ? req.file.path : user.avatar,
        },
      }
    );
    res.json(updated);
    done();
  } catch (err) {
    res.status(HttpCodes.NotFound).json({ message: err });
  }
};

const passwordUpdate = (req, res, done) => {
  const { _id } = req.user;
  const { oldPassword, newPassword } = req.body;

  User.findById(_id)
    .then(async (user) => {
      const correct = await bcrypt.compare(oldPassword, user.password);

      if (correct) {
        await User.updateOne(
          { _id },
          {
            $set: {
              password: await bcrypt.hash(newPassword, 10),
            },
          }
        );
        res.status(200).json({ message: "Password updated!" });
        done();
      } else {
        res.status(401).json({
          status: "error",
          message: "Password incorrect",
        });
      }
    })
    .catch(() => {
      res.status(404).json({
        status: "error",
        message: "No user found!",
      });
    });
};

const remove = async (req, res) => {
  const { _id } = req.user;
  try {
    const removedUser = await User.deleteOne({ _id });
    res.json(removedUser);
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  getUser,
  getUsers,
  update,
  passwordUpdate,
  remove,
};
