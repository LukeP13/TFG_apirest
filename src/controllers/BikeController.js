var mongoose = require("mongoose");
const { HttpCodes } = require("../../requestErrors");
const User = require("../models/User");

function sortIncoming(...bikes) {
  bikes = bikes.map((b) => {
    return {
      ...b,
    };
  });

  console.log(bikes);
  return bikes;
}

const getBike = async (req, res, done) => {
  const { bikes } = req.user;
  const { id } = req.params;

  try {
    const bike = await bikes.find(({ _id }) => id == _id);

    if (!bike) res.status(HttpCodes.NotFound).json();
    else res.json(sortIncoming(bike));
  } catch (e) {
    res.status(HttpCodes.InternalServerError).json();
  }

  done();
};

const getBikes = async (req, res, done) => {
  const { bikes } = req.user;
  res.json(bikes);
  done();
};

const postBike = async (req, res, done) => {
  let { _id, ...bike } = req.body;
  try {
    let revisions = bike.revisions.map((e) => ({
      ...e,
      _id: mongoose.Types.ObjectId(),
    }));
    bike = {
      ...bike,
      revisions,
      incomingRevisions: revisions,
    };

    const updated = await User.updateOne(
      { _id: req.user._id },
      { $push: { bikes: bike } },
      { new: true }
    );

    res.json(updated);
    done();
  } catch (err) {
    console.log(err);
    res.status(HttpCodes.InternalServerError).json({ message: err });
  }
};

const patchBike = async (req, res, done) => {};

const deleteBike = async (req, res, done) => {};

module.exports = {
  getBike,
  getBikes,
  postBike,
  patchBike,
  deleteBike,
};
