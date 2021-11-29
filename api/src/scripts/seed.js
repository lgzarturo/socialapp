const path = require("path");

const { Seeder } = require("mongo-seeding");

const config = require("./../config");

const seederConfig = {
  ...config,
  dropDatabase: true,
};

const seeder = new Seeder(seederConfig);

const collections = seeder.readCollectionsFromPath(
  path.resolve(__dirname, "./data")
);

(async function () {
  try {
    await seeder.import(collections);
    console.log("Seeding successfull");
  } catch (err) {
    console.log("Seeding failed");
    console.error(err);
  }
})();
