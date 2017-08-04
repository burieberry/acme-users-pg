// To do:
// updateUser(user, cb)
// deleteUser(id, cb)

var pg = require('pg');
var client = new pg.Client(process.env.DATABASE_URL);

client.connect((err) => {
  if (err) console.log(err.message);
});

function query(sql, params) {
  return new Promise((resolve, reject) => {
    client.query(sql, params, (err, result) => {
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
    })
    .catch((err) => console.error(err));
}

function createUser(user) {
  user.manager = !!user.manager;

  var sql = `
    INSERT INTO users(name, manager)
    VALUES ($1, $2)
    RETURNING id
  `;

  return query(sql, [ user.name, user.manager ])
    .then((result) => {
      console.log(result.rows[0].id);
      return result.rows[0].id;
    });
}

function getUser(id) {
  return query('SELECT * FROM users WHERE users.id = $1', [ id ])
    .then((result) => {
      return result.rows[0];
    });
}

function getUsers(managersOnly) {
  if (managersOnly) {
    return query('SELECT * FROM users WHERE users.manager = $1', [ true ])
      .then((result) => {
        return result.rows;
      });
  }

  else return query('SELECT * FROM users', null)
    .then((result) => {
      return result.rows;
    });
}

function updateUser(user) {
  return getUser(user.id)
    .then((result) => {
      return query('UPDATE users SET name = $1, manager = $2  WHERE id = $3', [ result.name, result.manager, result.id ])
    })
    .then(() => {
      return getUser(user.id);
    })
    .catch((err) => console.error(err));
}

module.exports = {
  sync,
  seed,
  createUser,
  getUser,
  getUsers,
  updateUser
};
