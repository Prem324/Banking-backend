const express = require('express');
const router = express.Router();
const { createAccount, getAllAccountsOfUser, getAccount, transferMoney} = require('../controllers/accountController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/createAccount', auth, createAccount);
router.get('/getAllAccountsOfUser/:userName', auth, getAllAccountsOfUser);
router.get('/getAccount/:id', auth, getAccount);
router.post('/api/transfer/sendMoney', auth, transferMoney);

module.exports = router; 