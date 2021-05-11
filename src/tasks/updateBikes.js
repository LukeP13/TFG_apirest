const TIME = require("../lib/time");
const User = require("../models/User");

async function updateIncomingRevisions() {
  try {
    (await User.find({}, { bikes: true })).forEach(({ bikes }) => {
      bikes.forEach(async ({ _id, distancePerYear }) => {
        let distancePerDay = distancePerYear / (TIME.YEAR / TIME.DAY);
        await User.updateMany(
          {},
          {
            $inc: {
              "bikes.$[bike].incomingRevisions.$[rev].time": -TIME.DAY,
            },
          },
          {
            arrayFilters: [
              { "bike._id": _id },
              {
                "rev.time": { $gt: 0 },
              },
            ],
          }
        );
        await User.updateMany(
          {},
          {
            $inc: {
              "bikes.$[bike].incomingRevisions.$[rev].distance":
                -distancePerDay,
            },
          },
          {
            arrayFilters: [
              { "bike._id": _id },
              {
                "rev.distance": { $gt: 0 },
              },
            ],
          }
        );
        await User.updateMany(
          {},
          {
            $inc: {
              "bikes.$[bike].totalDistance": +distancePerDay,
            },
          },
          {
            arrayFilters: [{ "bike._id": _id }],
          }
        );
      });
    });
  } catch (e) {
    console.log(e);
  }
}

async function checkNotifications(user) {
  /* TODO */
}

module.exports = updateIncomingRevisions;
