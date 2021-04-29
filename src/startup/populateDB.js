const User = require("../models/User");
const Brand = require("../models/Brand");

const brands = async () => {
  await Brand.deleteMany();
  await Brand.insertMany(
    [
      {
        name: "Kawasaki",
        models: [
          {
            name: "z250",
            revisions: [
              ,
              { name: "Periodic inspection" },
              { name: "Pneumatics check", time: null },
              { name: "Oil change", distance: null },
            ],
          },
          { name: "z800" },
          { name: "ninja 125" },
          { name: "er6-f" },
        ],
      },
      {
        name: "Ducati",
        models: [
          { name: "Panigale V4" },
          { name: "Supersport" },
          { name: "Multistrada 950" },
          { name: "Multistrada 1260" },
        ],
      },
      {
        name: "KTM",
        models: [
          { name: "Duke 125" },
          { name: "Duke 200" },
          { name: "RC 200" },
          { name: "RC 390" },
        ],
      },
    ],
    { setDefaultsOnInsert: true }
  );
};

const users = async () => {
  await User.deleteMany({});
  User.insertMany([
    {
      username: "postman",
      email: "postman@postman.com",
      password: "$2a$10$5ivwlytgRnoBuUTm3K5DveMDT9gtMN73FufgagSpmDYW4NPuOGBcW",
      phone: "666222999",
      avatar: "uploads\\1617206181664.png",
    },
  ]);
};

async function populateDB() {
  brands();
  //users();
}

module.exports = populateDB;
