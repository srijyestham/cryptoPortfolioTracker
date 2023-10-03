const { getDB } = require("../config/firebase");

const TOKEN_ID = "token";

class Token {
  constructor({tokens, updatedAt}) {
    this.tokens = tokens;
    this.updatedAt = updatedAt;
  }
}

class TokenModel {
  constructor() {
    this.db = getDB();
    this.tokenCollection = "token";
  }

  create = async (token) => {
    await this.db
      .collection(this.tokenCollection)
      .doc(TOKEN_ID)
      .set(Object.assign({}, token));
  };
  
  retrieve = async () => {
    return (await this.db.collection(this.tokenCollection).doc(TOKEN_ID).get()).data();
  };
}

module.exports = { Token, TokenModel };
