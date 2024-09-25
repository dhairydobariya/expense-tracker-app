const mongoose = require('mongoose')
const Expense = require('../models/expensemodel');
const fs = require('fs');
const csv = require('csv-parser');

// Create a new expense
const createExpense = async (req, res) => {
    try {
        const { title, amount, category, paymentMethod, date } = req.body;

        // Validate required fields
        if (!amount || !category || !paymentMethod) {
            return res.status(400).json({ message: 'Amount, category, and payment method are required' });
        }

        const newExpense = new Expense({
            title,
            amount,
            category,
            paymentMethod,
            date: date || new Date(), // Default to current date if not provided
            user: req.user.id // Add user ID from authenticated user
        });

        await newExpense.save();
        res.status(201).json({ message: 'Expense created successfully', data: newExpense });
    } catch (error) {
        res.status(500).json({ message: 'Error creating expense', error: error.message });
    }
};

// Get all expenses (with filtering, sorting, pagination)
let getAllExpenses = async (req, res) => {
    try {
        const userId = req.user.id;
        const { category, paymentMethod, startDate, endDate, sortBy, sortOrder = 'desc', page = 1, limit = 10 } = req.query;

        const filter = { user: userId };
        if (category) filter.category = category;
        if (paymentMethod) filter.paymentMethod = paymentMethod;

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const sort = sortBy ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 } : { date: -1 };

        // Validate page and limit values
        const validPage = Math.max(1, parseInt(page)); // Ensure page is at least 1
        const validLimit = Math.min(Math.max(1, parseInt(limit)), 100); // Limit to 100 records

        const skip = (validPage - 1) * validLimit;
        const expenses = await Expense.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(validLimit);

        const totalExpenses = await Expense.countDocuments(filter);

        res.json({
            expenses,
            totalExpenses,
            totalPages: Math.ceil(totalExpenses / validLimit),
            currentPage: validPage
        });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single expense by ID
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ data: expense });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense', error: error.message });
    }
};

// Update an expense by ID
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },  // Users can only update their own expenses
            { ...req.body },
            { new: true }
        );
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense updated successfully', data: expense });
    } catch (error) {
        res.status(500).json({ message: 'Error updating expense', error: error.message });
    }
};

// Delete an expense by ID
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error: error.message });
    }
};

// Upload CSV file
const uploadCSV = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const filePath = req.file.path;
    const expenses = [];

    // Read and parse the CSV file
    try {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const expense = {
                    title: row.title || 'Untitled',
                    amount: parseFloat(row.amount),
                    category: row.category || 'Miscellaneous',
                    paymentMethod: row.paymentMethod?.toLowerCase() || 'cash',
                    date: row.date ? new Date(row.date) : new Date(),
                    user: req.user.id
                };

                if (isNaN(expense.amount)) {
                    return res.status(400).json({ message: `Invalid amount value in row: ${JSON.stringify(row)}` });
                }

                expenses.push(expense);
            })
            .on('end', async () => {
                try {
                    await Expense.insertMany(expenses);
                    res.status(201).json({ message: 'Expenses uploaded successfully', data: expenses });

                    // Clean up the file after successful upload
                    fs.unlinkSync(filePath);
                } catch (error) {
                    res.status(500).json({ message: 'Error saving expenses', error: error.message });
                }
            })
            .on('error', (error) => {
                res.status(500).json({ message: 'Error processing CSV file', error: error.message });
            });
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
    }
};


// Bulk delete expenses
const bulkDeleteExpenses = async (req, res) => {
    try {
        const { expenseIds } = req.body; // Array of expense IDs to delete

        if (!expenseIds || expenseIds.length === 0) {
            return res.status(400).json({ message: 'No expense IDs provided for deletion' });
        }

        // Delete expenses that match the provided IDs and belong to the authenticated user
        const result = await Expense.deleteMany({ 
            _id: { $in: expenseIds }, 
            user: req.user.id 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No expenses found to delete' });
        }

        res.status(200).json({ message: 'Expenses deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expenses', error: error.message });
    }
};

// Get statistics

let getStatistics = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the request
        console.log("User ID:", userId);

        // Validate userId if necessary
        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
        if (!isValidObjectId) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Aggregation pipeline to calculate monthly total expenses by category for the user
        const monthlyExpensesByCategory = await Expense.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(userId) } // Match expenses for the specific user
            },
            {
                $group: {
                    _id: {
                        month: { $dateToString: { format: "%Y-%m", date: "$date" } }, // Group by year and month
                        category: "$category" // Group by category
                    },
                    totalAmount: { $sum: "$amount" } // Sum the amount for each category per month
                }
            },
            {
                $sort: { "_id.month": -1, "_id.category": 1 } // Sort by month descending and category ascending
            }
        ]);

        // Check if monthlyExpensesByCategory is empty and handle accordingly
        if (monthlyExpensesByCategory.length === 0) {
            return res.json([]); // Return an empty array if no expenses found
        }

        console.log("Monthly Expenses by Category:", monthlyExpensesByCategory); // Log the monthly expenses by category
        res.json(monthlyExpensesByCategory); // Send the monthly expenses by category as response
    } catch (error) {
        console.error("Error fetching user monthly expenses by category:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    uploadCSV,
    bulkDeleteExpenses,
    getStatistics,
    
};
