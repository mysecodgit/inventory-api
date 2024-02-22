const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Define the Account schema using zod
const accountSchema = z.object({
  name: z.string().min(1, "name is required"),
  accountType: z.string().min(1, "accountType is required"),
  balance: z.number().min(0, "balance must be a non-negative number"),
});

// Create an Account
exports.createAccount = async (req, res) => {
  try {
    const { name, accountType, balance } = accountSchema.parse(req.body);
    const account = await prisma.account.create({
      data: {
        name,
        accountType,
        balance,
      },
    });
    res.status(201).json({
      success: true,
      account,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Invalid data provided",
    });
  }
};

// Update an Account
exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, accountType, balance } = accountSchema.parse(req.body);
    const account = await prisma.account.update({
      where: { id: parseInt(id) },
      data: {
        name,
        accountType,
        balance,
      },
    });
    res.json({ success: true, account });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};

// Delete an Account
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await prisma.account.findUnique({
      where: { id: parseInt(id) },
    });

    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });

    await prisma.account.delete({
      where: { id: parseInt(id) },
    });
    res
      .status(200)
      .json({ success: true, message: "Account was successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get all Accounts
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await prisma.account.findMany();
    res.json({ success: true, accounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get a single Account by ID
exports.getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await prisma.account.findUnique({
      where: { id: parseInt(id) },
    });
    if (!account) {
      return res
        .status(404)
        .json({ success: false, error: "Account not found" });
    }
    res.json({ success: true, account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};