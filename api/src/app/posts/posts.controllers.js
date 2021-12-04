const AWS = require("aws-sdk");
const fs = require("fs").promises;
const config = require("../../config");
const path = require("path");

const Post = require("./posts.model");

var s3Client = new AWS.S3({ ...config.s3 });

exports.createPost = async (post, userId) => {
  return new Post({
    ...post,
    user: userId,
  }).save();
};

exports.saveImage = async (image, filename) => {
  if (!config.saveImagesInS3) {
    const pathServer = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "images",
      filename
    );
    console.log(pathServer);
    await fs.writeFile(pathServer, image);
    return `/images/${filename}`;
  }

  const pathS3 = `${config.s3.bucket}/${filename}`;
  await s3Client
    .putObject({
      Bucket: config.s3BucketName,
      Key: pathS3,
      Body: image,
      ACL: "public-read",
    })
    .promise();
  return `${config.s3BucketPath}${pathS3}`;
};
