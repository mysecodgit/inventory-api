const purchasePayment = require("../controllers/purchasePaymentController");

module.exports = (app) => {
  app.route("/api/purchase-payment").get(purchasePayment.getPurchasePayments);
  app
    .route("/api/purchase-payment/:id")
    .get(purchasePayment.getPurchasePaymentById);
  app
    .route("/api/purchase-payment")
    .post(purchasePayment.createPurchasePayment);
  app
    .route("/api/purchase-payment/:id")
    .post(purchasePayment.updatePurchasePayment);
  app
    .route("/api/purchase-payment/:id")
    .delete(purchasePayment.deletePurchasePayment);
};
