const vendor = require('../controllers/vendorController')

module.exports = (app) => {
    app.route('/api/vendor').get(vendor.getVendors)
    app.route('/api/vendor/:id').get(vendor.getVendorById)
    app.route('/api/vendor').post(vendor.createVendor)
    app.route('/api/vendor/:id').post(vendor.updateVendor)
    app.route('/api/vendor/:id').delete(vendor.deleteVendor)
}