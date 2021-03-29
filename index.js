const express = require('express');
const port = 8000;

const app = express();

//use express router
app.use('/', require('./routes'));

//set up view ejs
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        console.log(`Error in connecting to the server: ${err}`);
        return;
    }
    console.log(`The server is up and running at the port: ${port}`);
})