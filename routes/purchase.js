const purchase = require('../controllers/purchaseController');

module.exports = (app) => {
    app.route('/api/purchase').get(purchase.getPurchases);
    app.route('/api/purchase/:id').get(purchase.getPurchaseById);
    app.route('/api/purchase').post(purchase.createPurchase);
    app.route('/api/purchase/:id').post(purchase.updatePurchase);
    app.route('/api/purchase/:id').delete(purchase.deletePurchase);
};