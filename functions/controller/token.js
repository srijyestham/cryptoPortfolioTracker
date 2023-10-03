const { coinGeckoAxios } = require("../config/axios");
const { Token, TokenModel, TokenPrice } = require("../model/token");

const syncToken = async () => {
  try {
    const tokenModel = new TokenModel();
    const tokenData = await coinGeckoAxios.get('/coins/list');

    await tokenModel.create(new Token({
      tokens: tokenData.data,
      updatedAt: new Date(),
    }));

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

const syncTokenPrice = async () => {
  try {
    const tokenModel = new TokenModel();
    const tokenPriceData = await coinGeckoAxios.get('/coins/markets?vs_currency=USD');

    await tokenModel.createPrice(new TokenPrice({
      tokenPrices: tokenPriceData.data,
      updatedAt: new Date(),
    }));

    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

const getTokens = async (req, res) => {
  try {
    const tokenModel = new TokenModel();
    const tokenData = (await tokenModel.retrieve());

    console.log("Successfully get token");
    return res.status(200).json({
      data: tokenData
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
}

module.exports = { syncToken, syncTokenPrice, getTokens };
