// To do:
// GET '/users'
// POST '/users'
// PUT '/users/:id'
// DELETE '/users/:id'
// GET '/users/managers'

const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res, next) => {
  db.getUsers()
    .then(function(users) {
      res.render('users', { users: users });
    })
    .catch((err) => next(err));
});

router.get('/managers', (req, res, next) => {
  db.getUsers(true)
    .then(function(managers) {
      res.render('managers', { managers: managers });
    })
    .catch((err) => next(err));
});

router.post('/', (req, res, next) => {
  return db.createUser(req.body)
    .then(function() {
      if (req.body.manager) {
        db.getUser(req.body.id);
        res.redirect('/users/managers');
      }
      else {
        db.getUser();
        res.redirect('/users');
      }
    })
    .catch((err) => next(err));
});

router.put('/:id', (req, res, next) => {
  console.log(req.body);
  return db.updateUser(req.body)
    .then(() => {
      res.redirect('/users/managers');
    })
    .catch((err) => next(err));
});

module.exports = router;
