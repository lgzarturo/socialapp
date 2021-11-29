module.exports = {
  environment: "production",
  jwt: {
    secret: 'u?:!";lDK{K<,IAjx[y"SS#j?WHFwmOz1[u<f]=*Kk{PQgYGu^_1UUGq*riB-7[',
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  hideLogs: true,
  saveImagesInS3: true,
};
