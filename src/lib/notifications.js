const { firebaseSendNotification } = require("./firebase");
const fetch = require("node-fetch");

function sendNofification(tokens, notification) {
  let message = {
    to: tokens,
    ...notification,
  };

  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then(() => {
      console.log("sent");
    })
    .catch((err) => {
      console.log("error", err);
    });
}

module.exports = sendNofification;
