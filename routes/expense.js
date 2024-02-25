const expense = require('../controllers/expenseController')

module.exports = (app) => {
    app.route('/api/expense').get(expense.getExpenses)
    app.route('/api/expense/:id').get(expense.getExpenseById)
    app.route('/api/expense').post(expense.createExpense)
    app.route('/api/expense/:id').post(expense.updateExpense)
    app.route('/api/expense/:id').delete(expense.deleteExpense)
}