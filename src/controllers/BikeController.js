var mongoose = require("mongoose");
const { HttpCodes } = require("../../requestErrors");
const User = require("../models/User");

const sortBy = (first, second) => {
  if (first.distance === 0 || first.time === 0) return -1;
  else if (second.distance === 0 || second.time === 0) return 1;
  else if (first.inProgress) return -1;
  else if (second.inProgress) return 1;
  else if (first.distance != null && second.distance != null) {
    if (first.distance < second.distance) return -1;
    else if (first.distance == second.distance) return 0;
    else return 1;
  } else if (first.time != null && second.time != null) {
    if (first.time < second.time) return -1;
    else if (first.time == second.time) return 0;
    else return 1;
  }

  return 0;
};

const getBike = async (req, res, done) => {
  const { bikes } = req.user;
  const { id } = req.params;

  try {
    const bike = await bikes.find(({ _id }) => id == _id);

    if (!bike) res.status(HttpCodes.NotFound).json();
    else {
      bike.incomingRevisions.sort(sortBy);
      res.json(bike);
    }
  } catch (e) {
    console.log(e);
    res.status(HttpCodes.InternalServerError).json();
  }

  done();
};

const getBikes = async (req, res, done) => {
  const { bikes } = req.user;
  res.json(
    bikes.map((b) => {
      b.incomingRevisions && b.incomingRevisions.sort(sortBy);
      return b;
    })
  );
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
      { $push: { bikes: bike } }
    );

    res.json(updated);
    done();
  } catch (err) {
    res.status(HttpCodes.InternalServerError).json({ message: err });
  }
};

const patchBike = async (req, res, done) => {
  const { id } = req.params;
  let { revisions, incomingRevisions } = req.body;
  if (revisions && incomingRevisions)
    revisions.forEach((elem, i) => {
      let j = incomingRevisions.findIndex(
        (elem2) => JSON.stringify(elem) === JSON.stringify(elem2)
      );
      if (j >= 0) {
        let _id = mongoose.Types.ObjectId();
        req.body.revisions[i]._id = _id;
        req.body.incomingRevisions[j]._id = _id;
      }
    });

  const body = {};
  for (const item in req.body) {
    body[`bikes.$[elem].${item}`] = req.body[item];
  }

  try {
    const updated = await User.updateOne(
      { _id: req.user._id },
      {
        $set: body,
      },
      {
        arrayFilters: [{ "elem._id": id }],
        new: true,
      }
    );

    res.json(updated);
    done();
  } catch (err) {
    res
      .status(HttpCodes.InternalServerError)
      .json({ status: "error", message: err });
  }
};

const deleteBike = async (req, res, done) => {
  const { id } = req.params;
  try {
    const updated = await User.updateOne(
      { _id: req.user._id },
      {
        $pull: { bikes: { _id: id } },
      }
    );
    res.json(updated);
    done();
  } catch (err) {
    res
      .status(HttpCodes.InternalServerError)
      .json({ status: "error", message: err });
  }
};

module.exports = {
  getBike,
  getBikes,
  postBike,
  patchBike,
  deleteBike,
};
