const { getDB } = require("../config/firebase");

const db = getDB();
const positionCollection = "position";

const create = async (position) => {
  await db
    .collection(positionCollection)
    .doc(position.id)
    .set(Object.assign({}, position));
};

const retrieve = async (id) => {
  return await (await db.collection(positionCollection).doc(id).get()).data();
};

const update = async (id, position) => {
  await db
    .collection(positionCollection)
    .doc(id)
    .set(position, { merge: true });
};

const remove = async (id) => {
  await db.collection(positionCollection).doc(id).delete();
};

module.exports = { create, retrieve, update, remove };
