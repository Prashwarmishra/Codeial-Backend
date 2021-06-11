const path = require("path");
const fs = require("fs");
const rfs = require("rotating-file-stream");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const development = {
  name: "development",
  assets_path: "./assets",
  db_path: "codeial_development",
  session_secret: "BlahSomething",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: "false",
    auth: {
      user: "prashwarmishra@gmail.com",
      pass: "@Panzer1999",
    },
  },
  google_client_id:
    "853925351392-bcbu6jlkf3g8c2r846jrem7bm8oiff3d.apps.googleusercontent.com",
  google_client_secret: "mqwfIEpRD6i2sWEownL_4x9V",
  google_callback_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: "codeial",
  morgan: {
    mode: "dev",
    options: { stream: accessLogStream },
  },
};

const production = {
  name: "production",
  assets_path: process.env.CODEIAL_ASSETS_PATH,
  db_path: process.env.CODEIAL_DB_PATH,
  session_secret: process.env.CODEIAL_SESSION_SECRET,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: "false",
    auth: {
      user: process.env.CODEIAL_SMTP_USER,
      pass: process.env.CODEIAL_SMTP_PASS,
    },
  },
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODEIAL_JWT_SECRET,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

module.exports =
  eval(process.env.NODE_ENV) == undefined
    ? development
    : eval(process.env.NODE_ENV);
