const product = require('../controllers/productController');

module.exports = (app) => {
    app.route('/api/product').get(product.getProducts);
    app.route('/api/product/:id').get(product.getProductById);
    app.route('/api/product').post(product.createProduct);
    app.route('/api/product/:id').post(product.updateProduct);
    app.route('/api/product/:id').delete(product.deleteProduct);
};