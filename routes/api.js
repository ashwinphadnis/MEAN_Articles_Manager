const express = require('express');
const router = express.Router();
const Article = require('./../models/articles');    // Model to interact with mongo DB

// Intercepts all requests of  '/articles' route
// Checks if user is authenticated before allowing to post
// Get requests are allowed
router.use('/articles', function(req, res, next) {
    console.log(req.method + "<<<" + req.isAuthenticated());
    if(req.method == 'GET') {
        return next();
    }
    else if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.send({status: 'Authentication failure'});
    }
});

// Get all articles from Mongo DB
router.get ('/articles', function(req, res, next) {
    Article.find (function(err, articles) {
        if(err) return res.send(500, err);
        return res.send(articles);
    });
});

// Get specific article from Mongo DB
router.get ('/articles/:id', function(req, res, next) {
    Article.findById(req.params.id, function(err, article) {
        if(err) return res.send(err);
        return res.json(article);
    });
});

// Insert new article in Mongo DB
router.post ('/articles', function(req, res, next) {
    var newArticle = new Article();
    newArticle.username = req.body.username;
    newArticle.title = req.body.title;
    newArticle.text = req.body.text;
    newArticle.save(function(err, article) {
        if (err) return res.send(500, err);
        return res.json(article);
    });
});

// Middleware function that handles the article delete requests
router.delete ('/articles/:id', function(req, res, next) {
    Article.remove({_id: req.params.id}, function(err, article) {
        if (err) return res.send(err);
        res.json({message: 'Successfully deleted'});
    });
});

// Middleware function that updates the articles
router.put ('/articles', function(req, res, next) {
    Article.findOne({_id: req.body._id}, function(err, article) {
        if(err) {
            return res.send(err);
        }
        article.username = req.body.username;
        article.title = req.body.title;
        article.text = req.body.text;
        article.timeStamp = req.body.timeStamp;
        article.save(function(err, article) {
            if (err) return res.send(500, err);
            res.json({message: 'Article Updated'});
        });
    });
});

module.exports = router;