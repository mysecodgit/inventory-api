const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Define the SalesPayment schema using zod
const salesPaymentSchema = z.object({
  salesNo: z.string().min(1, "salesNo is required"),
  accountId: z.number().positive("accountId must be a positive number"),
  amount: z.number().positive("amount must be a positive number"),
  paymentDate: z.string(),
});

// Create a SalesPayment
exports.createSalesPayment = async (req, res) => {
  try {
    const { salesNo, accountId, amount, paymentDate } =
      salesPaymentSchema.parse(req.body);

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, error: "Account was not found" });
    }

    const salesPayment = await prisma.salesPayment.create({
      data: {
        sale: {
          connect: { salesNo },
        },
        account: {
          connect: { id: accountId },
        },
        amount,
        paymentDate,
      },
    });

    res.status(201).json({
      success: true,
      salesPayment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ success: false, err: error, error: "Invalid data provided" });
  }
};

// Update a SalesPayment
exports.updateSalesPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { salesNo, accountId, amount, paymentDate } =
      salesPaymentSchema.parse(req.body);

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, error: "Account was not found" });
    }

    const salesPayment = await prisma.salesPayment.update({
      where: { id: parseInt(id) },
      data: {
        sale: {
          connect: { salesNo },
        },
        account: {
          connect: { id: accountId },
        },
        amount,
        paymentDate,
      },
    });

    res.json({ success: true, salesPayment });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};

// Delete a SalesPayment
exports.deleteSalesPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const salesPayment = await prisma.salesPayment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!salesPayment)
      return res
        .status(404)
        .json({ success: false, message: "SalesPayment not found" });

    await prisma.salesPayment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "SalesPayment was successfully deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get all SalesPayments
exports.getSalesPayments = async (req, res) => {
  try {
    const salesPayments = await prisma.salesPayment.findMany();
    res.json({ success: true, salesPayments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get a single SalesPayment by ID
exports.getSalesPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesPayment = await prisma.salesPayment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!salesPayment) {
      return res
        .status(404)
        .json({ success: false, error: "SalesPayment not found" });
    }

    res.json({ success: true, salesPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
