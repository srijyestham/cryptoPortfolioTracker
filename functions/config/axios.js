const dotenv = require('dotenv');
const axios = require('axios');

const env = dotenv.config().parsed;

const coinGeckoAxios = axios.create({
  baseURL: env.COINGECKO_URL,
});

coinGeckoAxios.interceptors.request.use(config => {
  config.params = {
    ...config.params,
  };
  return config;
});

module.exports = { coinGeckoAxios }