const { v4: uuidv4 } = require("uuid");
const userModel = require("../model/user");
const accountModel = require("../model/account");
const Ajv = require("ajv");

const ajv = new Ajv();

const createUserSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string'
    },
  },
  required:['username']
}

const createUserValidate = ajv.compile(createUserSchema)

const createUser = async (req, res) => {
  try {
    const isValid = createUserValidate(req.body)
    if (!isValid) {
      return res.status(400).send(`the field ${validate.errors[0].instancePath.substring(1)}  ${validate.errors[0].message}`)
    }

    const userId = uuidv4();

    await userModel.create(new userModel.User({
      id: userId,
      username: req.body.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      isRemoved: false,
    }));

    const accountId = uuidv4();

    await accountModel.create(userId, new accountModel.Account({
      id: accountId,
      name: "Default",
      createdAt: new Date(),
      updatedAt: new Date(),
      isRemoved: false,
    }));

    res.status(201).json({
      userId,
      accountId,
      message: "successfully added user",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error,
    });
  }
};

module.exports = { createUser };
