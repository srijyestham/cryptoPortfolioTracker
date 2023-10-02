const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../config/firebase");

const db = getDB();
const accountCollection = "account";
const userAccountCollection = "userAccount";

class Account {
  constructor({id, name, createdAt, updatedAt, isRemoved}) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isRemoved = isRemoved;
  }
}

class UserAccount {
  constructor({id, userId, accountId, createdAt, updatedAt, isRemoved}) {
    this.id = id;
    this.userId = userId;
    this.accountId = accountId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isRemoved = isRemoved;
  }
}

const create = async (userId, account) => {
  await db
    .collection(accountCollection)
    .doc(account.id)
    .set(Object.assign({}, account));

  const userAccountId = uuidv4();
  const userAccount = new UserAccount({
    id: userAccountId,
    userId: userId,
    accountId: account.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    isRemoved: false,
  })

  await db
    .collection(userAccountCollection)
    .doc(userAccountId)
    .set(Object.assign({}, userAccount));
};

const retrieve = async (id) => {
  return await (await db.collection(accountCollection).doc(id).get()).data();
};

const update = async (id, account) => {
  await db
    .collection(accountCollection)
    .doc(id)
    .set(account, { merge: true });
};

const remove = async (id) => {
  await db.collection(accountCollection).doc(id).delete();
};

module.exports = { create, retrieve, update, remove, Account };
