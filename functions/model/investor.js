const { getDB } = require("../config/firebase");

class Investor {
  constructor({id, username, createdAt, updatedAt, isRemoved}) {
    this.id = id;
    this.username = username;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isRemoved = isRemoved;
  }
}

class InvestorModel {
  constructor() {
    this.db = getDB();
    this.investorCollection = "investor";
  }

  create = async (investor) => {
    await this.db
      .collection(this.investorCollection)
      .doc(investor.id)
      .set(Object.assign({}, investor));
  };

  retrieve = async (id) => {
    const investorData = (await this.db.collection(this.investorCollection).doc(id).get()).data();
    if (!investorData || investorData.isRemoved) {
      return undefined;
    }
    return investorData;
  };

  remove = async (id) => {
    await this.db
      .collection(this.investorCollection)
      .doc(id)
      .set({ isRemoved: true, updatedAt: new Date() }, { merge: true });
  };
}

module.exports = { Investor, InvestorModel };
