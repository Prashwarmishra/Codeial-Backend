const express = require('express');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

chatServer.listen(5000);
console.log('Chatsockets listening on port: 5000');

//set up middlewares
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    prefix: '/css',
    outputStyle: 'extended',
}));


//connect to mongoose
const db = require('./config/mongoose');
const User = require('./models/User');

//set up static files access
app.use(express.static('./assets'));

//set up access to uploaded files
app.use('/uploads', express.static('./uploads'));

//set up express-ejs-layouts
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up view ejs
app.set('view engine', 'ejs');
app.set('views', './views');

//set up sessions
app.use(session({
    name: 'Codeial',
    secret: 'BlahSomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    }, 
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/codeial_development',
        autoRemove: 'disabled',
    }, function(err){
        console.log(err || 'Mongo Connection Okay.');
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//set up connect flash
app.use(flash());
app.use(customMware.setFlash);

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