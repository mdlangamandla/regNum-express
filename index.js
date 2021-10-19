const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const Registration = require('./routes/registration');

const RegistrationService = require('./services/registration-services');

const pg = require("pg");
const Pool = pg.Pool;
const app = express();

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/regnumber';

const pool = new Pool({
    connectionString, 
    ssl: {
        rejectUnauthorized: false
    }
});

const registrationService = RegistrationService(pool);

const registrationRoute = Registration(registrationService);

const { request } = require('express');
const flash = require('express-flash');
const session = require('express-session');

// initialise session middleware - flash-express depends on it
app.use(session({
    secret: 'this is my long String that is used for session in http',
    resave: false,
    saveUninitialized: true
}));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// initialise the flash middleware
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/jsongreetInstance
app.use(bodyParser.json())
app.use(express.static('public'));

app.get("/", registrationRoute.homeRoute);
app.post('/reg_numbers', registrationRoute.addRegNumber);
app.get('/list', registrationRoute.allRegNumbers);
app.post('/town_reg', registrationRoute.townRegNumbers);
app.get('/reset',registrationRoute.reset); 

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`App started at port:${PORT}`)
})
