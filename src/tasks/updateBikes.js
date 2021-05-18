const sendNofification = require("../lib/notifications");
const TIME = require("../lib/time");
const User = require("../models/User");

async function updates(id, distPerDay) {
  let time = User.updateMany(
    {},
    {
      $inc: {
        "bikes.$[bike].incomingRevisions.$[rev].time": -TIME.DAY,
      },
      $set: {
        "bikes.$[bike].incomingRevisions.$[rev2].time": -TIME.DAY,
      },
    },
    {
      arrayFilters: [
        { "bike._id": id },
        {
          "rev.time": { $gt: 0 },
        },
        {
          "rev2.distance": { $lt: 0, $ne: null },
        },
      ],
    }
  );
  let dist = User.updateMany(
    {},
    {
      $inc: {
        "bikes.$[bike].incomingRevisions.$[rev].distance": -distPerDay,
      },
      $set: {
        "bikes.$[bike].incomingRevisions.$[rev2].distance": 0,
      },
    },
    {
      arrayFilters: [
        { "bike._id": id },
        {
          "rev.distance": { $gt: 0 },
        },
        {
          "rev2.distance": { $lt: 0, $ne: null },
        },
      ],
    }
  );
  let total = User.updateMany(
    {},
    {
      $inc: {
        "bikes.$[bike].totalDistance": +distPerDay,
      },
    },
    {
      arrayFilters: [{ "bike._id": id }],
    }
  );

  return Promise.all([time, dist, total]);
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
            ({ name, time, distance, notify }) =>
              (time === 0 || distance === 0) &&
              notify &&
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
