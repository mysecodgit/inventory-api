const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Define the Customer schema using zod
const customerSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
  address: z.string().min(1).optional(),
});

// Create a Customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = customerSchema.parse(req.body);
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });
    res.status(201).json({
      success: true,
      customer,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, err: error, error: "Invalid data provided" });
  }
};

// Update a Customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = customerSchema.parse(req.body);
    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        address,
      },
    });
    res.json({ success: true, customer });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};

// Delete a Customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    await prisma.customer.delete({
      where: { id: parseInt(id) },
    });
    res
      .status(200)
      .json({ success: true, message: "Customer was successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get all Customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json({ success: true, customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get a single Customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
    });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }
    res.json({ success: true, customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
