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

function query(sql, params) {
  return new Promise(function(resolve, reject) {
    client.query(sql, params, function(err, result){
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function sync() {
  var sql = `
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name CHARACTER VARYING(255) UNIQUE NOT NULL,
      manager BOOLEAN
    );
  `;

  return query(sql);
}

function seed() {
  return Promise.all([
    createUser({ name: 'Jake the Dog', manager: false }),
    createUser({ name: 'Finn the Human', manager: false }),
    createUser({ name: 'Princess Bubblegum', manager: true })
  ])
    .then(function(result) {
      console.log(result);
    });
}

function createUser(user) {
  var sql = `
    INSERT INTO users(name, manager)
    VALUES ($1, $2)
    RETURNING id
  `;

  return query(sql, [ user.name, user.manager ])
    .then(function(result) {
      return result.rows[0].id;
    });
}

// function getUser(id) {
//   return query('SELECT * FROM users WHERE users.id = $1', [ id ])
//     .then(function(result) {
//       console.log(id, result.rows);
//       return result.rows[0];
//     });
// }

function getUser() {
  return query('SELECT * FROM users', null)
    .then(function(result) {
      return result.rows;
    });
}

function getUsers(managersOnly) {
  return query('SELECT * FROM users WHERE users.manager = $1', [ true ])
    .then(function(result) {
      return result.rows;
    });
}

module.exports = {
  sync,
  seed,
  createUser,
  getUsers,
  getUser
};
