const mongoose = require("mongoose");
const { RevisionSchema } = require("./Revision");
const Schema = mongoose.Schema;

const ModelSchema = Schema({
  name: { type: String, required: true },

  //Parameters
  revisions: [{ type: RevisionSchema, default: {} }],
});

const Model = mongoose.model("Models", ModelSchema);
module.exports = {
  Model,
  ModelSchema,
};
