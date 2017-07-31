const express = require('express');
const db = require('./db');

const app = express();

// logging
app.use(function(req, res, next) {
  res.on('finish', function() {
    console.log(req.method, req.url, res.statusCode);
  });
  next();
});


app.get('/', function(req, res, next) {
  res.send('hello');
});

app.use(function(err, req, res, next) {
  app.render('error', { error: err });
});


const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`listening on port ${port}`);
  db.sync(function(err) {
    if (err) return console.log(err.message);
    db.seed(function(err) {
      if (err) return console.log(err.message);
      db.getUsers(function(err) {
        if (err) return console.log(err.message);
        console.log(db.users);
      });
    });
  });
});
