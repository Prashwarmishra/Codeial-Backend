const express = require('express');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const app = express();

app.use(express.static('./assets'));

app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

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