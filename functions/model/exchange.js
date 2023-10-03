const { getDB } = require("../config/firebase");

const EXCHANGE_ID = "exchange";

class Exchange {
  constructor({exchanges, updatedAt}) {
    this.exchanges = exchanges;
    this.updatedAt = updatedAt;
  }
}

class ExchangeModel {
  constructor() {
    this.db = getDB();
    this.exchangeCollection = "exchange";
  }

  create = async (exchange) => {
    await this.db
      .collection(this.exchangeCollection)
      .doc(EXCHANGE_ID)
      .set(Object.assign({}, exchange));
  };

  retrieve = async () => {
    return (await this.db.collection(this.exchangeCollection).doc(EXCHANGE_ID).get()).data();
  };
}

module.exports = { Exchange, ExchangeModel };
