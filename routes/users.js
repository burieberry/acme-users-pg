// To do:
// GET '/users'
// POST '/users'
// PUT '/users/:id'
// DELETE '/users/:id'
// GET '/users/managers'

const router = require('express').Router();
const db = require('../db');

router.get('/', (req, res, next) => {
  res.render('users');
});

router.get('/managers', (req, res, next) => {
  res.render('managers');
});

router.post('/', (req, res, next) => {
  return db.createUser(req.body)
    .then(function() {
      if (req.body.manager) {
        res.redirect('/users/managers');
      }
      else {
        res.redirect('/users');
      }
    })
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  return db.updateUser(req.body)
    .then((user) => {
      res.redirect(user.manager ? '/users/managers' : '/users');
    })
    .catch(next);
});

module.exports = router;
