const express = require('express');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const app = express();


//set up middlewares
app.use(cookieParser());
app.use(express.urlencoded());

//connect to mongoose
const db = require('./config/mongoose');
const User = require('./models/User');

//set up static files access
app.use(express.static('./assets'));

//set up express-ejs-layouts
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up view ejs
app.set('view engine', 'ejs');
app.set('views', './views');

//use express router
app.use('/', require('./routes'));

//set up server
app.listen(port, function(err){
    if(err){
        console.log(`Error in connecting to the server: ${err}`);
        return;
    }
    console.log(`The server is up and running at the port: ${port}`);
})