var mongoose = require("mongoose");
const { HttpCodes } = require("../../requestErrors");
const User = require("../models/User");

const patchRevision = async (req, res, done) => {
  const { revId } = req.params;
  const bikeId = req.bikeId;
  const body = {};
  for (const item in req.body) {
    body[`bikes.$[bike].revisions.$[rev].${item}`] = req.body[item];
    body[`bikes.$[bike].incomingRevisions.$[rev].${item}`] = req.body[item];
  }
  console.log(bikeId, revId, body);
  try {
    const updated = await User.updateOne(
      { _id: req.user._id },
      {
        $set: body,
      },
      {
        arrayFilters: [{ "bike._id": bikeId }, { "rev._id": revId }],
      }
    );

    res.json(updated);
    done();
  } catch (err) {
    console.log(err);
    res
      .status(HttpCodes.InternalServerError)
      .json({ status: "error", message: err });
  }
};

module.exports = {
  patchRevision,
};
