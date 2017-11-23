var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'aarav';

module.exports = function(router) {
    // http://localhost:1300/api/users - <testing with Google Chrome Addon ARC (Advanced Rest Client)
    //User Registration Route
    router.post('/users', function(req, res){
        var user = new User(); 
        user.username   = req.body.username;
        user.password   = req.body.password;
        user.email      = req.body.email; 

        if(req.body.username == null || req.body.username == '' ) {
            //res.send('Enter Username');
            res.json({success: false, message: 'Enter Username'});
        }; 
        
        if(req.body.password == null || req.body.password == '' ) {
            //res.send('Enter password');
            res.json({success: false, message: 'Enter password'});
        };
        
        if(req.body.email == null || req.body.email == '' ) {
            //res.send('Enter email');
            res.json({success: false, message: 'Enter email'});
        }
        else {
            user.save(function(err) {
                if (err) {res.json({success: false, message: 'Something Went Wrong'})
                        }
                else{res.json({success: true, message: 'User: '+ user.username + ' is created'});}
            });
        };
    });

    //User Login Route
    // http://localhost:1300/api/authenticate
    router.post('/authenticate', function(req, res){    
        User.findOne({username: req.body.username}).select('email username password').exec(function(err, user) {
            if(err) throw err;

            if(!user) {
                res.json({success: false, message: 'User not registered'});
            } else if(user) {
                //validate password
                if (req.body.password) {
                    var validPasssword = user.comparePassword(req.body.password);
                    if(!validPasssword) {
                        res.json({success: false, message: 'Incorrect Password for user'});
                    } else {
                        var token = jwt.sign({username: user.username, email: user.email}, secret, {expiresIn: '24h'});
                        res.json({success: true, message: 'Yoohoo....Authentication successful', token: token});
                    }
                } else {
                    res.json({success: false, message: 'Missing Password'});
                }
            }
        });
    });

    // Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token']; // Check for token in body, URL, or headers

        // Check if token is valid and not expired  
        if (token) {
            // Function to verify token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
                } else {
                    req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
                    next(); // Required to leave middleware
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
        }
    });

    // Route to get the currently logged in user    
    router.post('/me', function(req, res) {
        res.send(req.decoded); // Return the token acquired from middleware
    });


    return router; 
}