const { coinGeckoAxios } = require("../config/axios");
const { Exchange, ExchangeModel } = require("../model/exchange");

const syncExchange = async () => {
  try {
    const exchangeModel = new ExchangeModel();
    const exchangeData = await coinGeckoAxios.get('/exchanges');

    await exchangeModel.create(new Exchange({
      exchanges: exchangeData.data,
      updatedAt: new Date(),
    }));
  } catch (error) {
    console.log(error);
  }
};

const getExchanges = async (req, res) => {
  try {
    const exchangeModel = new ExchangeModel();
    const exchangeData = (await exchangeModel.retrieve());

    res.status(200).json({
      data: exchangeData
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
}

module.exports = { syncExchange, getExchanges };
