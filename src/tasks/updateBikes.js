const sendNofification = require("../lib/notifications");
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

function myNotification(body) {
  return {
    title: `Pending inspection`,
    body: `${body}`,
  };
}

async function checkNotifications(user) {
  (await User.find({}, { bikes: true, notificationTokens: true })).forEach(
    ({ bikes, notificationTokens }) => {
      let notif = [];
      notificationTokens &&
        bikes.forEach(({ name, incomingRevisions }) => {
          let revisions = [];
          incomingRevisions.forEach(
            ({ name, time, distance }) =>
              (time === 0 || distance === 0) && revisions.push(`${name}`)
          );
          revisions.length > 0 &&
            notif.push(`- ${name}: ${revisions.join(", ")}`);
        });

      notif.length > 1 &&
        sendNofification(notificationTokens, myNotification(notif.join("\n")));
    }
  );
}

module.exports = {
  updateIncomingRevisions,
  checkNotifications,
};
