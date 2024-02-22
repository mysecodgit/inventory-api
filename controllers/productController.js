const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Define the Product schema using zod
const productSchema = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().min(1).optional(),
  costPrice: z.number(),
  sellingPrice: z.number(),
  stock: z.number().int(),
});

// Create a Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, costPrice, sellingPrice, stock } =
      productSchema.parse(req.body);
    const product = await prisma.product.create({
      data: {
        name,
        description,
        costPrice,
        sellingPrice,
        stock,
      },
    });
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, err: error, error: "Invalid data provided" });
  }
};

// Update a Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, costPrice, sellingPrice, stock } =
      productSchema.parse(req.body);
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        costPrice,
        sellingPrice,
        stock,
      },
    });
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};

// Delete a Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res
      .status(200)
      .json({ success: true, message: "Product was successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get all Products
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get a single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};