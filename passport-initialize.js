// const mongoose = require('mongoose');
const User = require('./models/users');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    // Used to support persistent login sessions
    passport.serializeUser(function(user, done) {   // Gets user object and return its ID
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {   // Get Id and returns the user object
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Authentication for signup form
    passport.use('signup', new LocalStrategy({
        passReqToCallback : true    // Allows 'req' object to be passed in the function below
    },
        function(req, username, password, done) {   // username, password param names are case-sensitive
            findOrCreateUser = function() {
                User.findOne({'username':username}, function(err, user) {   // Try to find if user exists
                    if(err) {   // Any error connecting to db
                        return done(err);
                    }
                    if(user) {  // If use is found, return false
                        return done(null, false);
                    } else {    // If user doesn't exist, allow creating the user
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = createHash(password);    // Store password in hashed format
                        newUser.save(function(err) {
                            if(err) {
                                throw err;
                            }
                            return done(null, newUser); // return the newly created user
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        }
    ));

    // Called for signin routing
    passport.use('signin', new LocalStrategy({
        passReqToCallback : true    // Allows passing 'req' as a param to function below
    },
        function(req, username, password, done) {   // username and password params are case-sensitive
            User.findOne({'username' : username}, function(err, user) { // Check if user exists
                if (err) {
                    return done(err);
                }
                if (!user) {    // If user doesn't exist, return false
                    return done(null, false);
                }
                if (!isPasswordValid(user, password)) { // If user exists, check if password matches
                    return done(null, false);
                }
                return done(null, user);    // Return user object if success
            });
        }
    ));

    // Check if password is valid
    var isPasswordValid = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    };

    // Convert to hashed password
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};