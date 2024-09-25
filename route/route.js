let express = require("express");
let controll = require("../controllers/controller");
let route = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Default route
 *     description: Returns a welcome message.
 *     responses:
 *       200:
 *         description: Success
 */
route.get('/', controll.defaults);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Missing or invalid inputs
 *       500:
 *         description: Server error
 */
route.post('/register', controll.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Logs in a user with name and password, returning a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
route.post('/login', controll.login);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout a user
 *     description: Logs out the user by clearing the authentication token.
 *     responses:
 *       200:
 *         description: User successfully logged out
 */
route.get('/logout', controll.logout);

module.exports = route;
