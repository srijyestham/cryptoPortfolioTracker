const { coinGeckoAxios } = require("../config/axios");
const { Token, TokenModel } = require("../model/token");

const syncToken = async () => {
  try {
    const tokenModel = new TokenModel();
    const tokenData = await coinGeckoAxios.get('/coins/list');

    await tokenModel.create(new Token({
      tokens: tokenData.data,
      updatedAt: new Date(),
    }));
  } catch (error) {
    console.log(error);
  }
};

const getTokens = async (req, res) => {
  try {
    const tokenModel = new TokenModel();
    const tokenData = (await tokenModel.retrieve());

    res.status(200).json({
      data: tokenData
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
}

module.exports = { syncToken, getTokens };
