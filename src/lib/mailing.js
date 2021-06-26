const app = require("express")();
const mailer = require("express-mailer");

mailer.extend(app, {
});

app.engine("pug", require("pug").__express);
app.set("views", __dirname + "/../../res/mailViews");
app.set("view engine", "pug");

const sendPasswordCode = async (mail, code) => {
  var mailOptions = {
    to: mail,
    subject: "BikeInspec - Recovery code",
    resetCode: code,
  };

  // Send email.
  app.mailer.send("forgotPassword", mailOptions, function (error, message) {
    error && console.log(error);
  });
};

module.exports = {
  sendPasswordCode,
};
