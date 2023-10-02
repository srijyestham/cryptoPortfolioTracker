const { getDB } = require("../config/firebase");

const db = getDB();
const userCollection = "user";

class User {
  constructor({id, username, createdAt, updatedAt, isRemoved}) {
    this.id = id;
    this.username = username;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isRemoved = isRemoved;
  }
}

const create = async (user) => {
  console.log(user.id)
  await db
    .collection(userCollection)
    .doc(user.id)
    .set(Object.assign({}, user));
};

const retrieve = async (id) => {
  return await (await db.collection(userCollection).doc(id).get()).data();
};

const update = async (id, user) => {
  await db
    .collection(userCollection)
    .doc(id)
    .set(user, { merge: true });
};

const remove = async (id) => {
  await db.collection(userCollection).doc(id).delete();
};

module.exports = { create, retrieve, update, remove, User };
