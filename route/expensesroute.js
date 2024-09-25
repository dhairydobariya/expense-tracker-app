const express = require('express');
const router = express.Router();
const multer = require('../multer/multer');
const expenseController = require('../controllers/expenseController');
const  { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /expense/upload-expenses-csv:
 *   post:
 *     summary: Upload expenses from CSV
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Expenses uploaded successfully
 *       400:
 *         description: Invalid request
 */
router.post('/expense/upload-expenses-csv', authenticateUser, multer.single('file'), expenseController.uploadCSV);

/**
 * @swagger
 * /expense/bulk-delete:
 *   delete:
 *     summary: Bulk delete expenses
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expenseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Expenses deleted successfully
 *       400:
 *         description: No expense IDs provided
 */
router.delete('/expense/bulk-delete', authenticateUser, expenseController.bulkDeleteExpenses);

/**
 * @swagger
 * /expense/statistics:
 *   get:
 *     summary: Get expense statistics
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: Expense statistics retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/expense/statistics', authenticateUser, expenseController.getStatistics);

// Other routes like CRUD for expenses
/**
 * @swagger
 * /expense/create:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Required fields are missing
 */
router.post('/expense/create', authenticateUser, expenseController.createExpense);

/**
 * @swagger
 * /expense/all:
 *   get:
 *     summary: Get all expenses with filtering, sorting, and pagination
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: A list of expenses
 *       500:
 *         description: Server error
 */
router.get('/expense/all', authenticateUser,authorizeAdmin, expenseController.getAllExpenses);

/**
 * @swagger
 * /expense/{id}:
 *   get:
 *     summary: Get an expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense retrieved successfully
 *       404:
 *         description: Expense not found
 */
router.get('/expense/:id', authenticateUser, expenseController.getExpenseById);

/**
 * @swagger
 * /expense/{id}:
 *   put:
 *     summary: Update an expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       404:
 *         description: Expense not found
 */
router.put('/expense/:id', authenticateUser, expenseController.updateExpense);

/**
 * @swagger
 * /expense/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete('/expense/:id', authenticateUser, expenseController.deleteExpense);

module.exports = router;
