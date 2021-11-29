const environment = process.env.NODE_ENV || "development";

const baseConfig = {
  jwt: {},
  database: process.env.MONGODB_URI,
  port: process.env.PORT || 3000,
  hideLogs: environment === "production",
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  s3BucketName: process.env.S3_BUCKET_NAME,
  s3BucketPath: process.env.S3_BUCKET_PATH,
  saveImagesInS3: environment === "production",
};

let envConfig = {};

switch (environment) {
  case "dev":
  case "development":
    envConfig = require("./environments/dev");
    break;
  case "prod":
  case "production":
    envConfig = require("./environments/prod");
    break;
  case "test":
    envConfig = require("./environments/test");
    break;
  default:
    envConfig = require("./environments/dev");
}

module.exports = { ...baseConfig, ...envConfig };
