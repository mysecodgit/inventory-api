const account = require('../controllers/accountController')

module.exports = (app) => {
    app.route('/api/account').get(account.getAccounts)
    app.route('/api/account/:id').get(account.getAccountById)
    app.route('/api/account').post(account.createAccount)
    app.route('/api/account/:id').post(account.updateAccount)
    app.route('/api/account/:id').delete(account.deleteAccount)
}