const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const db = require('./db');

const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render)
nunjucks.configure('views', { noCache: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// logging
app.use(function(req, res, next) {
  res.on('finish', function() {
    console.log(req.method, req.url, res.statusCode);
  });
  next();
});

// app.post('/users', function(req, res, next) {
//   res.json();
// });

app.get('/', function(req, res, next) {
  res.render('index');
});

app.use('/users', require('./routes/users'));

app.use(function(err, req, res, next) {
  app.render('error', { error: err });
});


const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);

  db.sync()
    .then(function() {
      return db.seed();
    })
    .then(function() {
      return db.getUser();
    })
    .then(function(users) {
      console.log(users);
    });
});
