const { v4: uuidv4 } = require("uuid");
const { Position, PositionModel } = require("../model/position");
const { InvestorModel } = require("../model/investor");
const { TokenModel } = require("../model/token");
const { ExchangeModel } = require("../model/exchange");
const { coinGeckoAxios } = require("../config/axios");
const Ajv = require("ajv");

const ajv = new Ajv();

const createPositionSchema = {
  type: 'object',
  properties: {
    investorId: {
      type: 'string'
    },
    tokenId: {
      type: 'string'
    },
    exchangeId: {
      type: 'string'
    },
    value: {
      type: 'string',
      pattern: /^[0-9.]+$/.toString().slice(1, -1)
    }
  },
  required:['investorId', 'tokenId', 'exchangeId', 'value']
}
const createPositionValidate = ajv.compile(createPositionSchema)

const createPosition = async (req, res) => {
  try {
    const reqBody = JSON.parse(req.body);
    const isValid = createPositionValidate(reqBody)
    if (!isValid) {
      return res.status(400).send(createPositionValidate.errors)
    }

    const investorModel = new InvestorModel();
    const investorData = await investorModel.retrieve(reqBody.investorId);
    if (!investorData) {
      return res.status(400).send("Invalid Investor ID");
    }

    const tokenModel = new TokenModel();
    const tokenData = await tokenModel.retrieve();
    if (tokenData.tokens.filter((t) => t.id === reqBody.tokenId).length < 1) {
      return res.status(400).send("Invalid Token ID");
    }

    const exchangeModel = new ExchangeModel();
    const exchangeData = await exchangeModel.retrieve();
    if (exchangeData.exchanges.filter((e) => e.id === reqBody.exchangeId).length < 1) {
      return res.status(400).send("Invalid Exchange ID");
    }

    const positionModel = new PositionModel();
    const investorPositions = await positionModel.retrieve(reqBody.investorId);
    if (investorPositions.positions.filter((p) => p.tokenId === reqBody.tokenId).filter((p) => p.exchangeId === reqBody.exchangeId).length > 0) {
      return res.status(400).send("Please update existing position");
    }

    const positionId = uuidv4();

    await positionModel.create(reqBody.investorId, new Position({
      id: positionId,
      tokenId: reqBody.tokenId,
      exchangeId: reqBody.exchangeId,
      value: reqBody.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      isRemoved: false,
    }));

    res.status(201).json({
      positionId,
      message: "successfully created position",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
};

const getPositionSchema = {
  type: 'object',
  properties: {
    investorId: {
      type: 'string'
    },
  },
  required:['investorId']
}

const getPositionValidate = ajv.compile(getPositionSchema)

const getPosition = async (req, res) => {
  try {
    const isValid = getPositionValidate(req.params)
    if (!isValid) {
      return res.status(400).send(getPositionValidate.errors)
    }

    const investorModel = new InvestorModel();
    const investorData = await investorModel.retrieve(req.params.investorId);
    if (!investorData) {
      return res.status(400).send("Invalid Investor ID");
    }

    const positionModel = new PositionModel();

    const positions = await positionModel.retrieve(req.params.investorId);

    const positionPrice = (await coinGeckoAxios.get('/coins/markets?vs_currency=USD')).data;

    for (idx in positions.positions) {
      let usdUnit = 0;
      const unit = positionPrice.find((p) => p.id === positions.positions[idx].tokenId)
      if (unit) {
        usdUnit = unit.current_price;
      };
      positions.positions[idx].usdValue = usdUnit * Number(positions.positions[idx].value)
    }

    res.status(200).json({
      data: positions,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
};

const updatePositionSchema = {
  type: 'object',
  properties: {
    investorId: {
      type: 'string'
    },
    positionId: {
      type: 'string'
    },
    value: {
      type: 'string'
    }
  },
  required:['investorId', 'positionId', 'value']
}

const updatePositionValidate = ajv.compile(updatePositionSchema)

const updatePosition = async (req, res) => {
  try {
    const reqBody = JSON.parse(req.body);
    const isValid = updatePositionValidate(reqBody)
    if (!isValid) {
      return res.status(400).send(updatePositionValidate)
    }

    const investorModel = new InvestorModel();
    const investorData = await investorModel.retrieve(reqBody.investorId);
    if (!investorData) {
      return res.status(400).send("Invalid Investor ID");
    }

    const positionModel = new PositionModel();
    const positionData = await positionModel.retrieve(reqBody.investorId);
    if (positionData.positions.filter((p) => p.id === reqBody.positionId).length < 1) {
      return res.status(400).send("Invalid Position ID");
    }

    await positionModel.update(reqBody.investorId, { id: reqBody.positionId, value: reqBody.value });

    res.status(201).json({
      positionId: reqBody.positionId,
      message: "successfully updated position",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
};

const deletePositionSchema = {
  type: 'object',
  properties: {
    investorId: {
      type: 'string'
    },
    positionId: {
      type: 'string'
    },
  },
  required:['investorId', 'positionId']
}

const deletePositionValidate = ajv.compile(deletePositionSchema)

const deletePosition = async (req, res) => {
  try {
    const isValid = deletePositionValidate(req.params)
    if (!isValid) {
      return res.status(400).send(deletePositionValidate)
    }

    const investorModel = new InvestorModel();
    const investorData = await investorModel.retrieve(req.params.investorId);
    if (!investorData) {
      return res.status(400).send("Invalid Investor ID");
    }

    const positionModel = new PositionModel();
    const positionData = await positionModel.retrieve(req.params.investorId);
    if (positionData.positions.filter((p) => p.id === req.params.positionId).length < 1) {
      return res.status(400).send("Invalid Position ID");
    }

    await positionModel.remove(req.params.investorId, req.params.positionId);

    res.status(201).json({
      positionId: req.params.positionId,
      message: "successfully deleted position",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
};

module.exports = { createPosition, getPosition, updatePosition, deletePosition };
