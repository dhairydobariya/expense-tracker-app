let express = require("express");
let app = express();
let port = process.env.PORT || 4000;

let route = require('./route/route');
let expenseroute = require('./route/expensesroute');
let bodyparser = require('body-parser');
let mongoose = require('./db/database');
let cookieparser = require('cookie-parser');
require('dotenv').config();

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Expense Tracker API',
            version: '1.0.0',
            description: 'API documentation for Expense Tracker',
            contact: {
                name: 'Dhairy Dobariya',
                email: process.env.email
            },
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server'
            }
        ]
    },
    apis: ['./route/*.js', './controllers/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());

// Routes
app.use('/', route);
app.use('/', expenseroute);

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});
