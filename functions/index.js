const express = require("express");
const bodyParser = require("body-parser");
const { initApp, getAPI } = require("./config/firebase");
const { syncToken } = require("./controller/token");
const { syncExchange } = require("./controller/exchange");

// initialize firebase to access its services
initApp();

// Sync data from Coingecko
syncToken();
syncExchange();

// initialize express
const app = express();
const main = express();

main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

const webAPI = getAPI(main);
module.exports = { webAPI };

const investorRoutes = require("./routes/investor");
app.use("/investor", investorRoutes);

const tokenRoutes = require("./routes/token");
app.use("/token", tokenRoutes);

const exchangeRoutes = require("./routes/exchange");
app.use("/exchange", exchangeRoutes);

const positionRoutes = require("./routes/position");
app.use("/position", positionRoutes);
