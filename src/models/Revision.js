const mongoose = require("mongoose");
const TIME = require("../lib/time");
const Schema = mongoose.Schema;

const RevisionSchema = Schema({
  name: { type: String, required: true },
  description: { type: String },
  time: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
});

module.exports = {
  RevisionSchema,
};
