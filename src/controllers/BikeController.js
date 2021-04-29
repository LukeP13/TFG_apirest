const { HttpCodes } = require("../../requestErrors");
const User = require("../models/User");

const getBike = async (req, res, done) => {
  const { bikes } = req.user;
  const { id } = req.params;

  try {
    const bike = await bikes.find(({ _id }) => id == _id);

    if (!bike) res.status(HttpCodes.NotFound).json();
    else res.json(bike);
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
  const { _id } = req.user;
  const bike = req.body;
  try {
    const updated = await User.updateOne({ _id }, { $push: { bikes: bike } });
    res.json(updated);
    done();
  } catch (err) {
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
