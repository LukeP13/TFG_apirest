const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TIME = {
  SECOND: 1000,
  MINUTE: 1000 * 60,
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
  MONTH: 1000 * 60 * 60 * 24 * 30,
  YEAR: 1000 * 60 * 60 * 24 * 30 * 12,
};

const RevisionSchema = Schema({
  name: { type: String, required: true },
  time: { type: Number, default: TIME.MONTH },
  distance: { type: Number, default: 4000 },
});

module.exports = {
  RevisionSchema,
};
