const express = require('express');
const router = express.Router();
const Article = require('./../models/articles');    // Model to interact with mongo DB

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

module.exports = router;