// To do:
// GET '/users'
// POST '/users'
// PUT '/users/:id'
// DELETE '/users/:id'
// GET '/users/managers'

const router = require('express').Router();
const db = require('../db');

router.get('/', function(req, res, next) {
  res.render('users', {
    users: db.getUsers()
  });
});




module.exports = router;
