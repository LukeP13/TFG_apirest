const app = require("express")();
const mailer = require("express-mailer");

mailer.extend(app, {
  from: "no-reply@bikeInspec.com",
  host: "smtp.gmail.com", // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: "SMTP", // default is SMTP.
  auth: {
    user: "bikeInspectioner@gmail.com", // Your Email
    pass: "Kawa25Project", // Your Password
  },
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
