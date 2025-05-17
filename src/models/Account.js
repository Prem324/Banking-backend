const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ['Savings', 'Current', 'Fixed Deposit', 'Loan', 'Mortgage', 'Credit Card']
  },
  currentBalance: {
    type: Number,
    required: true,
    default: 0
  },
  nominee: {
    type: String,
    required: true
  },
  branchName: {
    type: String,
    required: true
  },
  placeOfBirth: {
    type: String
  },
  dateofbirth: {
    type: Date
  },
  phoneNumber: {
    type: String
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account; 