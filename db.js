// To do:
// sync(cb),  OK
// seed(cb),  OK
// getUsers(managersOnly, cb)
// getUser(id, cb)
// createUser(user, cb) OK
// updateUser(user, cb)
// deleteUser(id, cb)

var pg = require('pg');
var client = new pg.Client(process.env.DATABASE_URL);

client.connect(function(err) {
  if (err) console.log(err.message);
});

function query(sql, params, cb) {
  client.query(sql, params, cb);
}

function sync(cb) {
  var sql = `
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(255) UNIQUE NOT NULL,
      manager BOOLEAN
    );
  `;

  query(sql, null, function(err) {
    if (err) return cb(err);
    cb(null);
  });
}

function seed(cb) {
  createUser({ name: 'Jake the Dog', manager: 'false' }, function(err) {
    if (err) return cb(err);
    createUser({ name: 'Finn the Human', manager: 'false' }, function(err) {
      if (err) return cb(err);
      createUser({ name: 'Princess Bubblegum', manager: 'true' }, function(err) {
       if (err) return cb(err);
      });
    });
  });
}

function createUser(user, cb) {
  var sql = `
    INSERT INTO users(name, manager)
    VALUES ($1, $2)
    RETURNING id
  `;

  query(sql, [ user.name, user.manager ], function(err, result) {
    if (err) cb(err);
    cb(null, result.rows[0].id);
  });
}


module.exports = {
  sync,
  seed,
  createUser
};
