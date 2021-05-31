const User = require("../models/User");
const Brand = require("../models/Brand");
const TIME = require("../lib/time");

const defaultRevisions = [
  {
    name: "Periodic inspection",
    distance: 5000,
    time: 6 * TIME.MONTH,
  },
  {
    name: "Oil change",
    distance: 5000,
  },
  {
    name: "Oil filter",
    distance: 10000,
  },
  {
    name: "Chain tension",
    distance: 1000,
  },
  { name: "Pneumatics check", time: null, distance: 5000 },
  {
    name: "ITV",
    time: 2 * TIME.YEAR,
  },
  {
    name: "Engine valve balance",
    distance: 15000,
  },
  {
    name: "Timing Chain",
    distance: 100000,
    time: 10 * TIME.YEAR,
  },
];

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
              {
                name: "Periodic inspection",
                distance: 5000,
                time: 6 * TIME.MONTH,
              },
              { name: "Pneumatics check", time: null, distance: 1000 },
            ],
          },
          { name: "z800", revisions: defaultRevisions },
          { name: "ninja 125", revisions: defaultRevisions },
          { name: "er6-f", revisions: defaultRevisions },
        ],
      },
      {
        name: "Ducati",
        models: [
          { name: "Panigale V4", revisions: defaultRevisions },
          { name: "Supersport", revisions: defaultRevisions },
          { name: "Multistrada 950", revisions: defaultRevisions },
          { name: "Multistrada 1260", revisions: defaultRevisions },
        ],
      },
      {
        name: "KTM",
        models: [
          { name: "Duke 125", revisions: defaultRevisions },
          { name: "Duke 200", revisions: defaultRevisions },
          { name: "RC 200", revisions: defaultRevisions },
          { name: "RC 390", revisions: defaultRevisions },
        ],
      },
      {
        name: "BMW",
        models: [
          { name: "G 310 R", revisions: defaultRevisions },
          { name: "F 900 R", revisions: defaultRevisions },
          { name: "M 1000 RR", revisions: defaultRevisions },
          { name: "S 1000 RR", revisions: defaultRevisions },
          { name: "R 1000 RS", revisions: defaultRevisions },
          { name: "K 1600 GTL", revisions: defaultRevisions },
          { name: "R 18 Classic", revisions: defaultRevisions },
        ],
      },
      {
        name: "Harley-Davidson",
        models: [
          { name: "Iron 883", revisions: defaultRevisions },
          { name: "Iron 1200", revisions: defaultRevisions },
          { name: "Forty-eight", revisions: defaultRevisions },
          { name: "Softail Standard", revisions: defaultRevisions },
          { name: "Street Bob", revisions: defaultRevisions },
          { name: "Low Rider", revisions: defaultRevisions },
        ],
      },
      {
        name: "Honda",
        models: [
          { name: "CBR 1000RR", revisions: defaultRevisions },
          { name: "CBR 600RR", revisions: defaultRevisions },
          { name: "CRF150RB", revisions: defaultRevisions },
          { name: "CRF230F", revisions: defaultRevisions },
          { name: "CRF 1000L Africa Twin", revisions: defaultRevisions },
          { name: "NC750S DCT", revisions: defaultRevisions },
        ],
      },
      {
        name: "Indian Motorcycles",
        models: [],
      },
      {
        name: "Royal Endfield",
        models: [],
      },
      {
        name: "Suzuki",
        models: [],
      },
      {
        name: "Triumph",
        models: [],
      },
      {
        name: "Yamaha",
        models: [],
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
      email: "dryluck13@gmail.com",
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
