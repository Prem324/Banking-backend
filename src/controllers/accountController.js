const Account = require("../models/Account");

// Create new account
const createAccount = async (req, res) => {
  try {
    const accountData = {
      ...req.body,
      accountNumber: Math.floor(10000000 + Math.random() * 900000).toString(), // Generate 6-digit account number
      userName: req.body.userName,
    };

    // Check for required fields
    const requiredFields = [
      "accountType",
      "currentBalance",
      "nominee",
      "branchName",
      "country",
      "state",
      "city",
      "pincode",
      "userName",
    ];
    for (const field of requiredFields) {
      if (!accountData[field]) {
        return res
          .status(400)
          .json({ message: `Missing required field: ${field}` });
      }
    }

    // Check for duplicate account number (very rare, but possible)
    const existing = await Account.findOne({
      accountNumber: accountData.accountNumber,
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Account number already exists. Please try again." });
    }

    const account = new Account(accountData);
    await account.save();
    res.status(200).json({ message: "Account created successfully!", account });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create account.", error: error.message });
  }
};

// Get all accounts of a user
const getAllAccountsOfUser = async (req, res) => {
  try {
    const { userName } = req.params;
    if (!userName) {
      return res.status(400).json({ message: "Username is required." });
    }
    const accounts = await Account.find({ userName });
    if (!accounts || accounts.length === 0) {
      return res
        .status(200)
        .json({ message: "No accounts found for this user.", accounts: [] });
    }
    res.json({ message: "Accounts fetched successfully.", accounts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch accounts.", error: error.message });
  }
};

// Get single account by ID
const getAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Account ID is required." });
    }
    const account = await Account.findOne({ accountNumber: id });
    if (!account) {
      return res.status(404).json({ message: "Account not found." });
    }
    res.json({ message: "Account fetched successfully.", account });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch account.", error: error.message });
  }
};

// Transfer money between accounts
const transferMoney = async (req, res) => {
  try {
    const { accountNumber, amount, targetAccountNumber } = req.body;

    // Validate input
    if (!accountNumber || !targetAccountNumber || !amount || amount <= 0) {
      return res
        .status(400)
        .json({
          message:
            "Invalid transfer data. Please provide valid account numbers and a positive amount.",
        });
    }

    // Find source and target accounts
    const source = await Account.findOne({ accountNumber });
    const target = await Account.findOne({
      accountNumber: targetAccountNumber,
    });

    if (!source) {
      return res.status(404).json({ message: "Source account not found." });
    }
    if (!target) {
      return res.status(404).json({ message: "Target account not found." });
    }
    if (source.accountNumber === target.accountNumber) {
      return res
        .status(400)
        .json({ message: "Cannot transfer to the same account." });
    }
    if (source.currentBalance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in source account." });
    }

    // Perform transfer
    source.currentBalance -= amount;
    target.currentBalance += amount;

    await source.save();
    await target.save();

    res.status(200).json({ message: "Transfer successful." });
  } catch (error) {
    res.status(500).json({ message: "Transfer failed.", error: error.message });
  }
};

module.exports = {
  createAccount,
  getAllAccountsOfUser,
  getAccount,
  transferMoney,
};
