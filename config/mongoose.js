const mongoose = require("mongoose");
const env = require("./environment");

mongoose.connect(env.db_path, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to the database"));
db.once("open", function () {
  console.log("Connected to the database: mongodb");
});

module.exports = db;
