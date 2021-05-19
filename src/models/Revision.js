const mongoose = require("mongoose");
const TIME = require("../lib/time");
const Schema = mongoose.Schema;

const RevisionSchema = Schema({
  name: { type: String, required: true },
  description: { type: String },
  time: { type: Number },
  distance: { type: Number },
  notify: { type: Boolean, default: true },
  inProgress: { type: Boolean, default: false },
});

module.exports = {
  RevisionSchema,
};
