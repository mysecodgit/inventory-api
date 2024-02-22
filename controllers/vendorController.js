const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");

const prisma = new PrismaClient();

// Define the Vendor schema using zod
const vendorSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
  address: z.string().min(1).optional(),
});

// Create a Vendor
exports.createVendor = async (req, res) => {
  try {
    const { name, email, phone, address } = vendorSchema.parse(req.body);
    const vendor = await prisma.vendor.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });
    res.status(201).json({
      success: true,
      vendor,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, err: error, error: "Invalid data provided" });
  }
};

// Update a Vendor
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = vendorSchema.parse(req.body);
    const vendor = await prisma.vendor.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        address,
      },
    });
    res.json({ success: true, vendor });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: "Invalid data provided" });
  }
};

// Delete a Vendor
exports.deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { id: parseInt(id) },
    });

    if (!vendor)
      return res
        .status(404)
        .json({ success: false, message: "vendor not found" });

    await prisma.vendor.delete({
      where: { id: parseInt(id) },
    });
    res
      .status(200)
      .json({ success: true, message: "vendor was successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get all Vendors
exports.getVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany();
    res.json({ success: true, vendors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get a single Vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await prisma.vendor.findUnique({
      where: { id: parseInt(id) },
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, error: "Vendor not found" });
    }
    res.json({ success: true, vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};
