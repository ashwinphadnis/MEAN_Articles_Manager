var express = require('express');
var router = express.Router();

// Redirect to index.html for all calls to root
router.get ('/', function(req, res, next) {
   res.render ('index');
});

module.exports = router;
