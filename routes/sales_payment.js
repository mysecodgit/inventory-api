const salesPayment = require("../controllers/salesPaymentController");

module.exports = (app) => {
  app.route("/api/sales-payment").get(salesPayment.getSalesPayments);
  app
    .route("/api/sales-payment/:id")
    .get(salesPayment.getSalesPaymentById);
  app
    .route("/api/sales-payment")
    .post(salesPayment.createSalesPayment);
  app
    .route("/api/sales-payment/:id")
    .post(salesPayment.updateSalesPayment);
  app
    .route("/api/sales-payment/:id")
    .delete(salesPayment.deleteSalesPayment);
};
