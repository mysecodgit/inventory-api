const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Define the PurchasePayment schema using zod
const purchasePaymentSchema = z.object({
  purchaseNo: z.string().min(1, "purchaseNo is required"),
  accountId: z.number().positive("accountId must be a positive number"),
  amount: z.number().positive("amount must be a positive number"),
  paymentDate: z.string(),
});

// Create a PurchasePayment
exports.createPurchasePayment = async (req, res) => {
  try {
    const { purchaseNo, accountId, amount, paymentDate } =
      purchasePaymentSchema.parse(req.body);

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, error: "Account was not found" });
    }

    const purchasePayment = await prisma.purchasePayment.create({
      data: {
        purchase: {
          connect: { purchaseNo },
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
      purchasePayment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ success: false, err: error, error: "Invalid data provided" });
  }
};

// Update a PurchasePayment
exports.updatePurchasePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { purchaseNo, accountId, amount, paymentDate } =
      purchasePaymentSchema.parse(req.body);

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, error: "Account was not found" });
    }

    const purchasePayment = await prisma.purchasePayment.update({
      where: { id: parseInt(id) },
      data: {
        purchase: {
          connect: { purchaseNo },
        },
        account: {
          connect: { id: accountId },
        },
        amount,
        paymentDate,
      },
    });

    res.json({ success: true, purchasePayment });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ success: false, err: error, error: "Invalid data provided" });
  }
};

// Delete a PurchasePayment
exports.deletePurchasePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const purchasePayment = await prisma.purchasePayment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!purchasePayment)
      return res
        .status(404)
        .json({ success: false, message: "PurchasePayment not found" });

    await prisma.purchasePayment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "PurchasePayment was successfully deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get all PurchasePayments
exports.getPurchasePayments = async (req, res) => {
  try {
    const purchasePayments = await prisma.purchasePayment.findMany();
    res.json({ success: true, purchasePayments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get a single PurchasePayment by ID
exports.getPurchasePaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchasePayment = await prisma.purchasePayment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!purchasePayment) {
      return res
        .status(404)
        .json({ success: false, error: "PurchasePayment not found" });
    }

    res.json({ success: true, purchasePayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
