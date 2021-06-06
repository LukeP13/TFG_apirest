const sendNofification = require("../lib/notifications");
const TIME = require("../lib/time");
const User = require("../models/User");

async function updates(id, distPerDay) {
  let time = User.updateMany(
    {},
    {
      $inc: {
        "bikes.$[bike].incomingRevisions.$[revT].time": -TIME.DAY,
        "bikes.$[bike].incomingRevisions.$[revD].distance": -distPerDay,
        "bikes.$[bike].totalDistance": +distPerDay,
      },
      $set: {
        "bikes.$[bike].incomingRevisions.$[revT2].time": -TIME.DAY,
        "bikes.$[bike].incomingRevisions.$[revD2].distance": 0,
      },
    },
    {
      arrayFilters: [
        { "bike._id": id },
        {
          "revT.time": { $gt: 0 },
          "revT.inProgress": { $ne: true },
        },
        {
          "revT2.distance": { $lt: 0, $ne: null },
          "revT2.inProgress": { $ne: true },
        },
        {
          "revD.distance": { $gt: 0 },
          "revD.inProgress": { $ne: true },
        },
        {
          "revD2.distance": { $lt: 0, $ne: null },
          "revD2.inProgress": { $ne: true },
        },
      ],
    }
  );
  return time;
}

async function updateIncomingRevisions() {
  try {
    (await User.find({}, { bikes: true })).forEach(({ bikes }) => {
      bikes.forEach(
        async ({ _id, distancePerYear }) =>
          await updates(_id, distancePerYear / (TIME.YEAR / TIME.DAY))
      );
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
      notificationTokens.length > 0 &&
        bikes.forEach(({ name, incomingRevisions }) => {
          let revisions = [];
          incomingRevisions.forEach(
            ({ name, time, distance, notify, inProgress }) =>
              (time === 0 || distance === 0) &&
              notify &&
              !inProgress &&
              revisions.push(`${name}`)
          );
          revisions.length > 0 &&
            notif.push(`- ${name}: ${revisions.join(", ")}`);
        });

      notif.length > 0 &&
        sendNofification(notificationTokens, myNotification(notif.join("\n")));
    }
  );
}

module.exports = {
  updateIncomingRevisions,
  checkNotifications,
};
