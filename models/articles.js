const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    username: String,
    title: String,
    text: String,
    timeStamp: {type: Date, default: Date.now}
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;