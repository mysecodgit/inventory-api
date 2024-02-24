const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Define the schema for the sale details
const saleDetailSchema = z.object({
  productId: z.number().int(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive(),
});

// Define the schema for the sale
const saleSchema = z.object({
  salesNo: z.string(),
  customerId: z.number().int(),
  saleDate: z.string(),
  salesDetails: z.array(saleDetailSchema),
  total: z.number().positive(),
  paid: z.number(),
  discount: z.number(),
  accountId: z.number().int(),
});

// Create a Sale
exports.createSale = async (req, res) => {
  try {
    const {
      salesNo,
      customerId,
      saleDate,
      salesDetails,
      total,
      discount,
      paid,
      accountId,
    } = saleSchema.parse(req.body);

    // Check if the customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, error: "Account was not found" });
    }

    await prisma.$transaction(async (prisma) => {
      const sale = await prisma.sale.create({
        data: {
          salesNo,
          customer: { connect: { id: customerId } },
          saleDate: new Date(saleDate),
          salesDetails: {
            create: salesDetails.map((detail) => ({
              unitPrice: detail.unitPrice,
              quantity: detail.quantity,
              product: { connect: { id: detail.productId } },
            })),
          },
          total,
          discount,
        },
        include: { customer: true, salesDetails: true },
      });

      // Create the sales payment if paid is true
      if (paid > 0) {
        await prisma.salesPayment.create({
          data: {
            sale: { connect: { salesNo } },
            account: { connect: { id: accountId } }, // Replace `accountId` with the actual account ID
            amount: paid,
            paymentDate: new Date(),
          },
          include: { sale: true, account: true },
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
      for (const detail of salesDetails) {
        const { productId, quantity } = detail;
        await prisma.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } },
        });
      }

      res.status(201).json({
        success: true,
        sale,
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ success: false, err: error, error: "Invalid data provided" });
  }
};

// Update a Sale
exports.updateSale = async (req, res) => {
  try {
    const saleId = parseInt(req.params.id);
    const {
      salesNo,
      customerId,
      saleDate,
      salesDetails,
      total,
      discount,
      accountId,
    } = saleSchema.parse(req.body);

    // Check if the sale exists
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { salesDetails: true },
    });

    if (!sale) {
      return res.status(404).json({ success: false, error: "Sale not found" });
    }

    // Update the Sale
    await prisma.$transaction(async (prisma) => {
      const updatedSale = await prisma.sale.update({
        where: { id: saleId },
        data: {
          salesNo,
          customerId,
          saleDate,
          salesDetails: {
            deleteMany: { salesNo },
            create: salesDetails.map((detail) => ({
              unitPrice: detail.unitPrice,
              quantity: detail.quantity,
              product: { connect: { id: detail.productId } },
            })),
          },
          total,
          discount,
        },
        include: { salesDetails: true },
      });

      for (const detail of sale.salesDetails) {
        const { productId, quantity } = detail;
        await prisma.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity } },
        });
      }

      for (const detail of salesDetails) {
        const { productId, quantity } = detail;
        await prisma.product.update({
          where: { id: productId },
          data: { stock: { increment: quantity } },
        });
      }

      res.json({
        success: true,
        sale: updatedSale,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};

// Get a Sale by ID
exports.getSale = async (req, res) => {
  try {
    const saleId = parseInt(req.params.id);

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      return res.status(404).json({ success: false, error: "Sale not found" });
    }

    res.json({
      success: true,
      sale,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Delete a Sale
exports.deleteSale = async (req, res) => {
  try {
    const saleId = parseInt(req.params.id);

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      return res.status(404).json({ success: false, error: "Sale not found" });
    }

    await prisma.sale.delete({
      where: { id: saleId },
    });

    res.json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get all Sales
exports.getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany();

    res.json({
      success: true,
      sales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
