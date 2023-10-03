const { getDB } = require("../config/firebase");

class Position {
  constructor({id, tokenId, exchangeId, value, createdAt, updatedAt, isRemoved}) {
    this.id = id;
    this.tokenId = tokenId;
    this.exchangeId = exchangeId;
    this.value = value;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isRemoved = isRemoved;
  }
}

class PositionModel {
  constructor() {
    this.db = getDB();
    this.positionCollection = "position";
  }

  create = async (accountId, position) => {
    let accountPositions = (await this.db.collection(this.positionCollection).doc(accountId).get()).data();
    if (accountPositions) {
      accountPositions = { positions: [Object.assign({}, position), ...accountPositions.positions] };
    } else {
      accountPositions = { positions: [Object.assign({}, position)] };
    }

    await this.db
      .collection(this.positionCollection)
      .doc(accountId)
      .set(Object.assign({}, accountPositions));
  };
  
  retrieve = async (accountId) => {
    const positionData = (await this.db.collection(this.positionCollection).doc(accountId).get()).data();
    if (positionData) {
      positionData.positions = positionData.positions.filter((pos) => pos.isRemoved === false);
      return positionData;
    }
    return { positions: [] };
  };
  
  update = async (accountId, position) => {
    const accountPositions = (await this.db.collection(this.positionCollection).doc(accountId).get()).data();
    const accountPosition = accountPositions.positions.find((pos) => pos.id === position.id);
    accountPosition.value = position.value;
    accountPosition.updatedAt = new Date();
    accountPositions.positions = [accountPosition, ...accountPositions.positions.filter((pos) => pos.id !== position.id)];
    await this.db
      .collection(this.positionCollection)
      .doc(accountId)
      .set(accountPositions, { merge: true });
  };
  
  remove = async (accountId, positionId) => {
    const accountPositions = (await this.db.collection(this.positionCollection).doc(accountId).get()).data();
    const accountPosition = accountPositions.positions.find((pos) => pos.id === positionId);
    accountPosition.isRemoved = true;
    accountPosition.updatedAt = new Date();
    accountPositions.positions = [accountPosition, ...accountPositions.positions.filter((pos) => pos.id !== positionId)];
    await this.db
      .collection(this.positionCollection)
      .doc(accountId)
      .set(accountPositions, { merge: true });
  };
}

module.exports = { Position, PositionModel };
