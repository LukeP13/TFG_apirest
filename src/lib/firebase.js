var admin = require("firebase-admin");

var serviceAccount = require("../../res/bikeinspectioner-ade6982e9805.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://bikeinspectioner-default-rtdb.europe-west1.firebasedatabase.app",
});

async function firebaseSendNotification(notification, tokens) {
  console.log(tokens);
  return admin.messaging().sendMulticast({ notification, tokens });
}

module.exports = { firebaseSendNotification };
