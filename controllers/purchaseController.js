const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

const purchaseSchema = z.object({
  purchaseNo: z.string().min(1, "purchaseNo is required"),
  vendorId: z.number().int().positive("vendorId must be a positive integer"),
  purchaseDate: z.string(),
  purchaseDetails: z.array(
    z.object({
      productId: z
        .number()
        .int()
        .positive("productId must be a positive integer"),
      quantity: z
        .number()
        .int()
        .positive("quantity must be a positive integer"),
      unitPrice: z.number().positive("quantity must be a positive float"),
    })
  ),
  paid: z.number().optional(),
  total: z.number().positive("total must be a positive number"),
  discount: z.number().min(0, "discount cannot be negative"),
  accountId: z.number().min(1, "Account must have number"),
  status: z.enum(["pending", "complete"]),
});

// Create a Purchase
exports.createPurchase = async (req, res) => {
  try {
    const {
      purchaseNo,
      vendorId,
      purchaseDate,
      purchaseDetails,
      paid,
      total,
      discount,
      status,
      accountId,
    } = purchaseSchema.parse(req.body);

    // Check if the vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, error: "Vendor not found" });
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, error: "Account was not found" });
    }

    // Create the Purchase
    await prisma.$transaction(async (prisma) => {
      const purchase = await prisma.purchase.create({
        data: {
          purchaseNo,
          vendor: { connect: { id: vendorId } },
          purchaseDate: new Date(purchaseDate),
          purchaseDetails: {
            create: purchaseDetails.map((detail) => ({
              unitPrice: detail.unitPrice,
              quantity: detail.quantity,
              product: { connect: { id: detail.productId } },
            })),
          },
          total,
          discount,
          status,
        },
        include: { vendor: true, purchaseDetails: true },
      });

      // Create the PurchasePayment if paid is true
      if (paid > 0) {
        await prisma.purchasePayment.create({
          data: {
            purchase: { connect: { purchaseNo } },
            account: { connect: { id: accountId } }, // Replace `accountId` with the actual account ID
            amount: paid,
            paymentDate: new Date(),
          },
          include: { purchase: true, account: true },
        });

        await prisma.transaction.create({
          data: {
            account: { connect: { id: accountId } }, // Replace `accountId` with the actual account ID
            amount: paid,
            transactionDate: new Date(),
          },
        });
      }

      // Update product stock
      for (const detail of purchaseDetails) {
        const { productId, quantity } = detail;
        await prisma.product.update({
          where: { id: productId },
          data: { stock: { increment: quantity } },
        });
      }

      res.status(201).json({
        success: true,
        purchase,
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ success: false, err: error, error: "Invalid data provided" });
  }
};

// Update a Purchase
exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      purchaseNo,
      vendorId,
      purchaseDate,
      purchaseDetails,
      purchasePayments,
      total,
      discount,
      status,
    } = req.body;
    const purchase = await prisma.purchase.update({
      where: { id: parseInt(id) },
      data: {
        purchaseNo,
        vendor: { connect: { id: vendorId } },
        purchaseDate,
        purchaseDetails: { create: purchaseDetails },
        purchasePayments: { create: purchasePayments },
        total,
        discount,
        status,
      },
      include: { vendor: true, purchaseDetails: true, purchasePayments: true },
    });
    res.json({ success: true, purchase });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};

// Delete a Purchase
exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await prisma.purchase.findUnique({
      where: { id: parseInt(id) },
    });

    if (!purchase)
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });

    await prisma.purchase.delete({
      where: { id: parseInt(id) },
    });
    res
      .status(200)
      .json({ success: true, message: "Purchase was successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get all Purchases
exports.getPurchases = async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { vendor: true, purchaseDetails: true, purchasePayments: true },
    });
    res.json({ success: true, purchases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get a single Purchase by ID
exports.getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await prisma.purchase.findUnique({
      where: { id: parseInt(id) },
      include: { vendor: true, purchaseDetails: true, purchasePayments: true },
    });
    if (!purchase) {
      return res
        .status(404)
        .json({ success: false, error: "Purchase not found" });
    }
    res.json({ success: true, purchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
