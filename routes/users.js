// To do:
// GET '/users'
// POST '/users'
// PUT '/users/:id'
// DELETE '/users/:id'
// GET '/users/managers'

const router = require('express').Router();
const db = require('../db');

router.get('/', function(req, res, next) {
  db.getUser().then(function(users) {
    res.render('users', { users: users });
  }).catch(function(err) {
    next(err);
  });
});

router.get('/managers', function(req, res, next) {
  db.getUsers(true).then(function(managers) {
    res.render('managers', { managers: managers });
  }).catch(function(err) {
    next(err);
  });
});

router.post('/', function(req, res, next) {
  return db.createUser(req.body)
    .then(function(managersOnly) {
      console.log(managersOnly);
      if (managersOnly) {
        db.getUser(managersOnly);
        res.redirect('/users/managers');
      }
      else {
        db.getUser();
        res.redirect('/users');
      }
    })
    .catch(function(err) {
      next(err);
    });
});


module.exports = router;
