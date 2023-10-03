const { getDB } = require("../config/firebase");

const TOKEN_ID = "token";
const TOKEN_PRICE_ID = "tokenPrice";

class Token {
  constructor({tokens, updatedAt}) {
    this.tokens = tokens;
    this.updatedAt = updatedAt;
  }
}

class TokenPrice {
  constructor({tokenPrices, updatedAt}) {
    this.tokenPrices = tokenPrices;
    this.updatedAt = updatedAt;
  }
}

class TokenModel {
  constructor() {
    this.db = getDB();
    this.tokenCollection = "token";
    this.tokenPriceCollection = "tokenPrice";
  }

  create = async (token) => {
    await this.db
      .collection(this.tokenCollection)
      .doc(TOKEN_ID)
      .set(Object.assign({}, token));
  };

  createPrice = async (tokenPrice) => {
    await this.db
      .collection(this.tokenPriceCollection)
      .doc(TOKEN_PRICE_ID)
      .set(Object.assign({}, tokenPrice));
  }
  
  retrieve = async () => {
    return (await this.db.collection(this.tokenCollection).doc(TOKEN_ID).get()).data();
  };

  retrievePrice = async () => {
    return (await this.db.collection(this.tokenPriceCollection).doc(TOKEN_PRICE_ID).get()).data();
  }
}

module.exports = { Token, TokenPrice, TokenModel };
