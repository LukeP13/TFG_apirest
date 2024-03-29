require("dotenv/config");

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cron = require("node-cron");

const AuthRoute = require("./src/routes/auth");
const UsersRoute = require("./src/routes/users");
const BrandsRoute = require("./src/routes/brands");
const BikesRoute = require("./src/routes/bikes");

const {
  default: authenticate,
  fullUser,
} = require("./src/middlewares/authenticate");
const populateDB = require("./src/startup/populateDB");
const {
  updateIncomingRevisions,
  checkNotifications,
} = require("./src/tasks/updateBikes");

//Connect DB
mongoose.connect(process.env.REMOTE_DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Database Connection Established!");
});

/**** APP ****/
const app = express();

//Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

//Start listening
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

//Import routes
const preroute = process.env.PREROUTE || "";

//Public routes
app.use(`${preroute}/`, AuthRoute);
app.use(`${preroute}/brands`, BrandsRoute);

//Private routes
app.use(`${preroute}/user`, authenticate, UsersRoute);
app.use(`${preroute}/bikes`, authenticate, fullUser, BikesRoute);

//Notifications
cron.schedule("00 00 00 * * *", () => {
  updateIncomingRevisions()
    .then(checkNotifications)
    .catch(() => {
      console.log("Error updating incoming revisions");
    });
});
