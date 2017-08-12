var pg = require('pg');
var client = new pg.Client(process.env.DATABASE_URL);

client.connect((err) => {
  if (err) console.log(err.message);
});

function query(sql, params){
  return new Promise(function(resolve, reject){
    client.query(sql, params, function(err, result){
      if(err){
        return reject(err);
      }
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

  return query(sql, null);
}

function seed() {
  return Promise.all([
    createUser({ name: 'Jake the Dog', manager: false }),
    createUser({ name: 'Finn the Human', manager: false }),
    createUser({ name: 'Princess Bubblegum', manager: true })
  ])
    .catch((err) => {
      console.error(err);
    });
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
      return result.rows[0].id;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getUser(id) {
  return query('SELECT * FROM users WHERE users.id = $1', [ id ])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.error(err);
    });
}

function getUsers(managersOnly) {
  if (managersOnly) {
    return query('SELECT * FROM users WHERE users.manager = $1', [ true ])
      .then((result) => {
        return result.rows;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  else return query('SELECT * FROM users', null)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.error(err);
    });
}

function updateUser(user) {
  var sql = `
    UPDATE users
    SET name = $1, manager = $2
    WHERE id = $3
  `;

  return getUser(user.id)
    .then(result => {
      return query(sql, [ result.name, user.manager, result.id ]);
    })
    .then(() => {
      return getUser(user.id);
    })
    .catch((err) => {
      return console.log(err)
    });
}

function deleteUser(user) {
  var sql = `
    DELETE FROM users
    WHERE id = $1
  `;

  return getUser(user.id)
    .then(result => {
      return query(sql, [ result.id ])
    })
    .catch((err) => {
      return console.log(err)
    });
}

module.exports = {
  sync,
  seed,
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser
};
