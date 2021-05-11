const mongoose = require("mongoose");
const { RevisionSchema } = require("./Revision");
const Schema = mongoose.Schema;

const ModelSchema = Schema({
  name: { type: String, required: true },
  distancePerYear: { type: Number, default: 0 },
  totalDistance: { type: Number, default: 0 },

  //Parameters
  incomingRevisions: [{ type: RevisionSchema, default: {} }],
  revisions: [{ type: RevisionSchema, default: {} }],
});

const Model = mongoose.model("Models", ModelSchema);
module.exports = {
  Model,
  ModelSchema,
};
