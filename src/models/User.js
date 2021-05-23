const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ModelSchema } = require("./Model");

const UserSchema = Schema(
  {
    //Login details
    username: { type: String, required: true, unique: true, min: 6, max: 255 },
    email: { type: String, required: true, unique: true, min: 6, max: 255 },
    password: { type: String, required: true, max: 1024 },

    //Optional
    phone: { type: String, max: 15 },
    avatar: { type: String },

    //Generated
    notificationTokens: [String],
    bikes: [ModelSchema],
    resetCode: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);
module.exports = User;
