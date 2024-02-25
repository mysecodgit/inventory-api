const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Define the Expense schema using zod
const expenseSchema = z.object({
  name: z.string().min(1, "name is required"),
  accountId: z.number().positive("accountId must be a positive number"),
  amount: z.number().positive("amount must be a positive number"),
  expenseDate: z.string(),
});

// Create an Expense
exports.createExpense = async (req, res) => {
  try {
    const { name, accountId, amount, expenseDate } = expenseSchema.parse(
      req.body
    );

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, error: "Account was not found" });
    }

    const expense = await prisma.expense.create({
      data: {
        name,
        account: {
          connect: { id: accountId },
        },
        amount,
        expenseDate,
      },
    });

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};

// Update an Expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, accountId, amount, expenseDate } = expenseSchema.parse(
      req.body
    );

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, error: "Account was not found" });
    }

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        name,
        account: {
          connect: { id: accountId },
        },
        amount,
        expenseDate,
      },
    });

    res.json({ success: true, expense });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};

// Delete an Expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense)
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Expense was successfully deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get all Expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.json({ success: true, expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get a single Expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense not found" });
    }

    res.json({ success: true, expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
