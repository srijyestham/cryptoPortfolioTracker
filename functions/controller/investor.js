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
    const reqBody = JSON.parse(req.body);
    const isValid = await createInvestorValidate(reqBody)
    if (!isValid) {
      const valError = createInvestorValidate.errors;
      return res.status(400).send(`Please check input: ${valError[0].dataPath.substring(1)}. It ${valError[0].message}.`);
    }

    const investorModel = new InvestorModel();
    const investorId = uuidv4();

    await investorModel.create(new Investor({
      id: investorId,
      username: reqBody.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      isRemoved: false,
    }));

    console.log(`Successfully create investor ${investorId}. Data: ${JSON.stringify(reqBody)}`);

    return res.status(201).json({
      investorId,
      message: "successfully added investor",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
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
      const valError = deleteInvestorValidate.errors;
      return res.status(400).send(`Please check input: ${valError[0].dataPath.substring(1)}. It ${valError[0].message}.`);
    }

    const investorModel = new InvestorModel();
    const investorData = await investorModel.retrieve(req.params.investorId);
    if (!investorData) {
      return res.status(400).send("Invalid Investor ID");
    }

    await investorModel.remove(req.params.investorId);

    console.log(`Successfully delete investor ${req.params.investorId}.`);

    return res.status(200).json({
      investorId: req.params.investorId,
      message: "successfully deleted investor",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
};

module.exports = { createInvestor, deleteInvestor };
