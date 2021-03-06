const express = require('express');
const nunjucks = require('nunjucks');
nunjucks.configure('views', { noCache: true });
const path = require('path');

const db = require('./db');

const app = express();

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('method-override')('_method'));

app.use(require('morgan')('dev'));  // logging

app.use('/', express.static(path.join(__dirname, 'node_modules')));

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use((req, res, next) => {
  res.locals.path = req.url;

  db.getUsers(false)
    .then(users => {
      res.locals.users = users;
      return db.getUsers(true);
    })
    .then(managers => {
      res.locals.managers = managers;
      next();
    })
    .catch(next);
})

app.get('/', (req, res, next) => {
  res.render('index');
});

app.use('/users', require('./routes/users'));

app.use((req, res, next) => {
  const error = new Error('Page not found.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', { error: err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);

  db.sync()
    .then(db.seed)
    .then(db.getUsers)
    .catch((err) => {
      console.error(err);
    });
});
