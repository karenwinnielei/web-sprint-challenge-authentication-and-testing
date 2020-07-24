const db = require('../database/dbConfig');

module.exports = {
  add,
  find,
  findBy,
  findById,
};

async function add(user) {
  try {
    const [id] = await db('users').insert(user, 'id');
  } catch (error) {
    throw error;
  }
}

function find() {
  return db('users').select('id', 'usersname').orderBy('id');
}

function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users').where({ id }).first();
}
