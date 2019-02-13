const express = require('express');
const router = express.Router();
// const User = require('../models/users');

module.exports = function(passport) {
    // sends successful login back to angular
    router.get('/success', function(req, res) {
        res.send({state : 'success', user : req.user ? req.user : null});
    });

    // sends failure login state back to angular
    router.get('/failure', function(req, res) {
        res.send({state : 'failure', user : null, message : 'Invalid user name or password'});
    });

    // sign in
    router.post('/signin', passport.authenticate('signin', {
        successRedirect : '/auth/success',
        failureRedirect : '/auth/failure'
    }));

    // /* ANOTHER WAY TO CALL AUTHENTICATION FUNCTION - PROVIDES INFO ABOUT ANY ERRORS FOR DEBUGGING */
    // /* START */
    // router.post('/signup', function(req, res, next) {
    //     passport.authenticate('signup', function(err, user, info) {
    //         console.log(info);
    //       if (err) { return next(err); }
    //       if (user) { return res.redirect('/#/'); }
    //       return res.redirect('http://www.google.com');
    //     //   req.logIn(user, function(err) {
    //     //     if (err) { return next(err); }
    //     //     return res.redirect('/users/' + user.username);
    //     //   });
    //     })(req, res, next);
    //   });
    //   /* END */

    // sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect : '/auth/success',
        failureRedirect : '/auth/failure'
    }));

    // logout
    router.get('signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;

}
