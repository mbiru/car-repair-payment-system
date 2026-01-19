# Car Repair Payment Management System (CRPMS)

A comprehensive web application for managing car repairs, services, and payments for SmartPark car repair company in Rubavu, Rwanda.

## Project Structure

```
FirstName_LastName_National_Practical_Exam_2025/
├── ERD_DESIGN.txt                    # Entity Relationship Diagram
├── database_setup.sql                 # MySQL database setup script
├── backend-project/                   # Node.js + Express backend
│   ├── server.js                     # Main server file
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables
│   ├── middleware/
│   │   └── auth.js                   # Authentication middleware
│   └── routes/
│       ├── user.js                   # User authentication routes
│       ├── car.js                    # Car CRUD routes
│       ├── service.js                # Service CRUD routes
│       ├── serviceRecord.js          # ServiceRecord CRUD routes
│       ├── payment.js                # Payment routes
│       └── report.js                 # Reports and bills routes
└── frontend-project/                  # React.js frontend
    ├── package.json                  # Frontend dependencies
    ├── public/
    │   └── index.html                # HTML template
    ├── src/
    │   ├── App.js                    # Main app component
    │   ├── index.js                  # Entry point
    │   ├── index.css                 # Global styles
    │   ├── context/
    │   │   └── AuthContext.js        # Authentication context
    │   └── components/
    │       ├── Layout.js             # Main layout with sidebar
    │       ├── Login.js              # Login page
    │       ├── Dashboard.js          # Dashboard page
    │       ├── Car.js                # Car management
    │       ├── Services.js           # Services management
    │       ├── ServiceRecord.js      # Service records management
    │       ├── Payment.js            # Payment management
    │       └── Reports.js            # Reports and bills
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Open MySQL command line or MySQL Workbench
2. Run the database setup script:
   ```sql
   source database_setup.sql
   ```
   Or copy and paste the contents of `database_setup.sql` into MySQL

3. Verify the database was created:
   ```sql
   USE CRPMS;
   SHOW TABLES;
   SELECT * FROM Services;
   ```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - The `.env` file is already created with default values
   - Update if your MySQL credentials are different:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=CRPMS
     PORT=5000
     SESSION_SECRET=your-secret-key-change-in-production
     ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000` and automatically open in your browser.

### 4. Default User

To create a user account:
1. Use the registration endpoint (see Postman collection)
2. Or manually insert a user in the database:
   ```sql
   INSERT INTO User (Username, Password) VALUES 
   ('admin', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq');
   ```
   Note: The password hash above is a placeholder. Use the registration API or generate a proper bcrypt hash.

## Features

### Authentication
- Session-based authentication
- Strong password validation (min 8 chars, uppercase, lowercase, numbers)
- Password encryption using bcrypt
- Protected routes

### Car Management
- Add new cars (INSERT)
- View all cars (GET)
- View car by plate number (GET)

### Services Management
- Add new services (INSERT)
- View all services (GET)
- View service by code (GET)
- Pre-populated with 6 default services

### Service Records Management (Full CRUD)
- Add new service records (INSERT)
- View all service records (GET)
- View record by number (GET)
- Update service records (PUT)
- Delete service records (DELETE)
- Retrieve detailed record information

### Payment Management
- Add new payments (INSERT)
- View all payments (GET)
- View payments by car (GET)

### Reports & Bills
- Daily reports: Filter by date, shows services and payments per car
- Bill generation: Generate printable bills for any car with:
  - Car details
  - All services performed
  - All payments made
  - Total service amount
  - Total paid amount
  - Balance

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/check` - Check authentication status

### Cars
- `POST /api/cars` - Add new car
- `GET /api/cars` - Get all cars
- `GET /api/cars/:plateNumber` - Get car by plate number

### Services
- `POST /api/services` - Add new service
- `GET /api/services` - Get all services
- `GET /api/services/:serviceCode` - Get service by code

### Service Records
- `POST /api/service-records` - Add new service record
- `GET /api/service-records` - Get all service records
- `GET /api/service-records/:recordNumber` - Get record by number
- `PUT /api/service-records/:recordNumber` - Update service record
- `DELETE /api/service-records/:recordNumber` - Delete service record

### Payments
- `POST /api/payments` - Add new payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/car/:plateNumber` - Get payments by car

### Reports
- `GET /api/reports/daily?date=YYYY-MM-DD` - Get daily report
- `GET /api/reports/bills/:plateNumber` - Generate bill for car

## Testing with Postman

A Postman collection is provided in `postman_collection.json`. Import it into Postman to test all API endpoints.

### Important Notes for Testing:
1. Start with registration or login to get a session
2. All routes except `/api/users/register` and `/api/users/login` require authentication
3. Use cookies/sessions in Postman (enable "Send cookies" in settings)

## CRUD Limitations

As per requirements:
- **INSERT**: Available for all entities (Car, Services, ServiceRecord, Payment)
- **GET**: Available for all entities
- **PUT/UPDATE**: Only available for ServiceRecord
- **DELETE**: Only available for ServiceRecord

## Responsive Design

The application is fully responsive using Tailwind CSS:
- Desktop: Full sidebar navigation
- Tablet: Responsive grid layouts
- Mobile: Stacked layouts, mobile-friendly forms

## Security Features

1. **Password Encryption**: All passwords are hashed using bcrypt
2. **Session Management**: Express-session for secure session handling
3. **Input Validation**: Server-side validation for all inputs
4. **SQL Injection Protection**: Using parameterized queries
5. **CORS Configuration**: Configured for frontend origin only

## Generating Reports

### Daily Report
1. Navigate to Reports page
2. Select a date
3. Click "Generate Daily Report"
4. View services and payments grouped by car

### Bill Generation
1. Navigate to Reports page
2. Enter a plate number
3. Click "Generate Bill"
4. View printable bill with all details
5. Click "Print Bill" to print

## Troubleshooting

### Backend Issues
- **Database connection error**: Check MySQL is running and credentials in `.env` are correct
- **Port already in use**: Change PORT in `.env` or kill the process using port 5000
- **Module not found**: Run `npm install` again

### Frontend Issues
- **Cannot connect to backend**: Ensure backend is running on port 5000
- **CORS errors**: Check backend CORS configuration
- **Build errors**: Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Database Issues
- **Table doesn't exist**: Run `database_setup.sql` again
- **Foreign key errors**: Ensure parent records exist before creating child records

## Cleanup Instructions

To remove the project after testing:

1. **Stop servers**: Press `Ctrl+C` in both terminal windows

2. **Delete project folder**:
   ```bash
   # Windows
   rmdir /s /q "John_Doe_National_Practical_Exam_2025"
   
   # Linux/Mac
   rm -rf "John_Doe_National_Practical_Exam_2025"
   ```

3. **Drop database**:
   ```sql
   DROP DATABASE CRPMS;
   ```

## Exam Checklist

✅ ERD with proper entities and relationships  
✅ Database setup with all tables and foreign keys  
✅ Pre-populated Services table  
✅ Backend with Express.js and MySQL  
✅ Session-based authentication  
✅ Password encryption with bcrypt  
✅ Strong password validation  
✅ CRUD operations with specified limitations  
✅ RESTful API endpoints  
✅ Frontend with React.js  
✅ Tailwind CSS for responsive design  
✅ All required components and pages  
✅ Reports and bill generation  
✅ Error handling  
✅ Input validation  
✅ Protected routes  

## Support

For issues or questions, refer to the code comments or check the console logs for detailed error messages.

---

**Developed for SmartPark Car Repair Company**  
**Rubavu, Rwanda**
