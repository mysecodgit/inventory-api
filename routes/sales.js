const sale = require('../controllers/salesController');

module.exports = (app) => {
    app.route('/api/sale').get(sale.getSales);
    app.route('/api/sale/:id').get(sale.getSale);
    app.route('/api/sale').post(sale.createSale);
    app.route('/api/sale/:id').post(sale.updateSale);
    app.route('/api/sale/:id').delete(sale.deleteSale);
};