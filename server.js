var express = require('express'); // ExperssJS Framework
var app = express(); // Invoke express to variable for use in application
var port = process.env.PORT || 1300; // Set default port or assign a port in enviornment
var morgan = require('morgan'); // Import Morgan Package
var mongoose = require('mongoose'); // HTTP request logger middleware for Node.js
var bodyParser = require('body-parser'); // Node.js body parsing middleware. Parses incoming request bodies in a middleware before your handlers, available under req.body.
var router = express.Router(); // Invoke the Express Router
var appRoutes = require('./app/routes/api')(router); // Import the application end points/API
var path = require('path'); // Import path module
//var passport = require('passport'); // Express-compatible authentication middleware for Node.js.
//var social = require('./app/passport/passport')(app, passport); // Import passport.js End Points/API


app.use(morgan('dev')); // Morgan Middleware
app.use(bodyParser.json()); // Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); // Allow front end to access public folder
app.use('/api', appRoutes); // Assign name to end points (e.g., '/api/management/', '/api/users' ,etc. )
 
mongoose.connect('mongodb://localhost:27017/BWA', { useMongoClient: true }, function(err){
    if (err) {console.log('error ='+err);}
    else {console.log('I am up and running buddy...');}
});
mongoose.Promise = global.Promise;

// Set Application Static Layout
// __dirname denotes current directory name
// * denotes whatever user enters after http://localhost:1300/ it would still consider that as http://localhost:1300
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html')); // Set index.html as layout
});


app.get('/', function(req, res) {res.send('Hej Aarav & Aaryan')});
 
app.listen(port, function() {
    console.log('Running the server on port ' + port); // Listen on configured port
});
