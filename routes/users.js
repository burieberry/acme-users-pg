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

router.delete('/:id', (req, res, next) => {
  return db.deleteUser(req.body)
    .then(user => res.redirect('/users'))
    .catch(next);
});

module.exports = router;
