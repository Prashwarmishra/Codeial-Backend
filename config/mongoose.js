const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codeial_development', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to the database"));
db.once('open', function(){
    console.log("Connected to the server :: mongodb");
});

module.exports = db;