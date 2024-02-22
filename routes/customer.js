const customer = require('../controllers/customerController')

module.exports = (app) => {
    app.route('/api/customer').get(customer.getCustomers)
    app.route('/api/customer/:id').get(customer.getCustomerById)
    app.route('/api/customer').post(customer.createCustomer)
    app.route('/api/customer/:id').post(customer.updateCustomer)
    app.route('/api/customer/:id').delete(customer.deleteCustomer)
}