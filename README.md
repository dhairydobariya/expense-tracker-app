/**
 * # Expense Tracker API
 * 
 * This is a comprehensive API for tracking expenses with features like user authentication, role-based access control (admin and normal users), CSV upload for bulk expenses, CRUD operations on expenses, advanced filtering, sorting, pagination, and statistics generation.
 * 
 * ## Live API URL:
 * [Expense Tracker App on Render](https://expense-tracker-app-ucwb.onrender.com)
 * 
 * ---
 * ## Features:
 * - **User Authentication:** Login via JWT, with roles (admin, user).
 * - **Admin Role:** Admin can access all expenses, while normal users can only access their own.
 * - **CSV Upload:** Users can upload expenses in bulk via CSV.
 * - **CRUD Operations:** Create, read, update, and delete individual or bulk expenses.
 * - **Advanced Filtering & Pagination:** Filter by category, payment method, date range, and paginate results.
 * - **Expense Statistics:** Generate monthly reports on expenses by category.
 * - **Swagger API Documentation:** [Swagger UI Documentation](https://expense-tracker-app-ucwb.onrender.com/api-docs)
 * 
 * ---
 * ## Endpoints:
 * 
 * ### Authentication
 * - **POST** `/login`: User login, returns JWT token.
 * - **POST** `/register`: User registration, creates new user.
 * 
 * ### Expense Routes
 * - **POST** `/expense/create`: Create a new expense.
 * - **GET** `/expense/all`: Fetch all expenses (Admin can access all users' expenses, normal users can only access their own).
 * - **GET** `/expense/:id`: Fetch a specific expense by ID.
 * - **PUT** `/expense/:id`: Update an existing expense by ID.
 * - **DELETE** `/expense/:id`: Delete an expense by ID.
 * - **DELETE** `/expense/bulk-delete`: Bulk delete expenses.
 * 
 * ### CSV Upload
 * - **POST** `/expense/upload-expenses-csv`: Upload multiple expenses via CSV.
 * 
 * ### Statistics
 * - **GET** `/expense/statistics`: Fetch monthly expense statistics grouped by category.
 * 
 * ---
 * ## JSON Examples for Postman:
 * 
 * ### 1. **User Registration** (POST: `/register`)
 * ```json
 * {
 *   "name": "user",
 *   "email":"user@example.com",
 *   "password": "securepassword",
 *   "role": "user"  // or "admin"
 * }
 * ```
 * 
 * ### 2. **User Login** (POST: `/login`)
 * ```json
 * {
 *   "name": "user",
 *   "password": "securepassword"
 * }
 * ```
 * 
 * ### 3. **Create a New Expense** (POST: `/expense/create`)
 * ```json
 * {
 *   "title": "Groceries",
 *   "amount": 150.50,
 *   "category": "Food",
 *   "paymentMethod": "Credit Card",
 *   "date": "2023-09-25T10:30:00Z"
 * }
 * ```
 * 
 * ### 4. **Get All Expenses** (GET: `/expense/all`)
 * No request body required. Only accessible by **Admin**.
 * 
 * ### 5. **Get Expense by ID** (GET: `/expense/:id`)
 * No request body required.
 * 
 * ### 6. **Update an Expense** (PUT: `/expense/:id`)
 * ```json
 * {
 *   "title": "Groceries",
 *   "amount": 120.00,
 *   "category": "Food",
 *   "paymentMethod": "Debit Card",
 *   "date": "2023-09-28T10:30:00Z"
 * }
 * ```
 * 
 * ### 7. **Delete an Expense** (DELETE: `/expense/:id`)
 * No request body required.
 * 
 * ### 8. **Bulk Delete Expenses** (DELETE: `/expense/bulk-delete`)
 * ```json
 * {
 *   "expenseIds": [
 *     "64fc1234abcd5678ef901234",
 *     "64fc2345bcde6789fg012345"
 *   ]
 * }
 * ```
 * 
 * ### 9. **Upload Expenses via CSV** (POST: `/expense/upload-expenses-csv`)
 * Send as `multipart/form-data`:
 * - Key: `file`
 * - Value: CSV file containing rows like:
 *   ```
 *   title,amount,category,paymentMethod,date
 *   Groceries,150.50,Food,Credit Card,2023-09-25T10:30:00Z
 *   Gas,45.00,Transport,Cash,2023-09-20T08:15:00Z
 *   ```
 * 
 * ### 10. **Expense Statistics** (GET: `/expense/statistics`)
 * No request body required.
 * 
 * ---
 * ## Role-Based Access Control:
 * - **Admin**: Can view all expenses and perform CRUD operations on any expense.
 * - **Normal User**: Can view and manage only their own expenses.
 * 
 * ---
 * ## Environment Setup
 * 
 * - **Node.js version**: v14+
 * - **Install Dependencies**:
 *   ```bash
 *   npm install
 *   ```
 * 
 * - **Environment Variables**:
 *   ```bash
 *   JWT_SECRET=your_jwt_secret
 *   MONGODB_URI=your_mongodb_uri
 *   ```
 * 
 * - **Run Locally**:
 *   ```bash
 *   npm start
 *   ```
 * 
 * ---
 * ## Testing in Postman:
 * 1. Copy the JSON examples above into Postman requests.
 * 2. For endpoints requiring authentication, make sure to include the JWT token in the headers or as a cookie.
 * 
 * ## Swagger Documentation
 * For detailed API specifications, visit the Swagger UI here:
 * [Swagger API Docs](https://expense-tracker-app-ucwb.onrender.com/api-docs)
 * 
 * ---
 * ## License
 * MIT License
 */
