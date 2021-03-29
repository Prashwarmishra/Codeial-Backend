const express = require('express');
const port = 8000;

const app = express();

app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in connecting to the server: ${err}`);
        return;
    }
    console.log(`The server is up and running at the port: ${port}`);
})