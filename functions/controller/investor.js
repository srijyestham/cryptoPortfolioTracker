const { v4: uuidv4 } = require("uuid");
const { Investor, InvestorModel } = require("../model/investor");
const Ajv = require("ajv");

const ajv = new Ajv();

const createInvestorSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string'
    },
  },
  required:['username']
}

const createInvestorValidate = ajv.compile(createInvestorSchema)

const createInvestor = async (req, res) => {
  try {
    const isValid = await createInvestorValidate(req.body)
    if (!isValid) {
      return res.status(400).send(createInvestorValidate.errors)
    }

    const investorModel = new InvestorModel();
    const investorId = uuidv4();

    await investorModel.create(new Investor({
      id: investorId,
      username: req.body.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      isRemoved: false,
    }));

    res.status(201).json({
      investorId,
      message: "successfully added user",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
};

const deleteInvestorSchema = {
  type: 'object',
  properties: {
    investorId: {
      type: 'string'
    },
  },
  required:['investorId']
}

const deleteInvestorValidate = ajv.compile(deleteInvestorSchema)

const deleteInvestor = async (req, res) => {
  try {
    const isValid = deleteInvestorValidate(req.params)
    if (!isValid) {
      return res.status(400).send(deleteInvestorValidate)
    }

    const investorModel = new InvestorModel();

    await investorModel.remove(req.params.investorId);

    res.status(200).json({
      investorId: req.params.investorId,
      message: "successfully deleted investor",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
};

module.exports = { createInvestor, deleteInvestor };
