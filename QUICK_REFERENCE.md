# Quick Reference Guide

## Quick Start (3 Commands)

```bash
# Terminal 1 - Backend
cd backend-project && npm install && npm run dev

# Terminal 2 - Frontend  
cd frontend-project && npm install && npm start

# Terminal 3 - Database
mysql -u root -p < database_setup.sql
```

## Create Admin User

```bash
cd backend-project
node create_user.js admin Admin@123
```

## Default Services (Pre-populated)

1. Engine repair - 150,000 RWF
2. Transmission repair - 80,000 RWF
3. Oil Change - 60,000 RWF
4. Chain replacement - 40,000 RWF
5. Disc replacement - 400,000 RWF
6. Wheel alignment - 5,000 RWF

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Common Commands

### Backend
```bash
npm install          # Install dependencies
npm start           # Production mode
npm run dev         # Development mode
```

### Frontend
```bash
npm install          # Install dependencies
npm start           # Start dev server
npm run build       # Production build
```

### Database
```sql
USE CRPMS;                    # Select database
SHOW TABLES;                  # List all tables
SELECT * FROM Services;        # View services
SELECT * FROM Car;            # View cars
DROP DATABASE CRPMS;          # Delete database
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## CRUD Matrix

| Entity | INSERT | GET | PUT | DELETE |
|--------|--------|-----|-----|--------|
| Car | ✅ | ✅ | ❌ | ❌ |
| Services | ✅ | ✅ | ❌ | ❌ |
| ServiceRecord | ✅ | ✅ | ✅ | ✅ |
| Payment | ✅ | ✅ | ❌ | ❌ |

## Sample Data

### Add Car
```json
{
  "plateNumber": "RAA 123A",
  "type": "Sedan",
  "model": "Toyota Corolla",
  "manufacturingYear": 2020,
  "driverPhone": "+250788123456",
  "mechanicName": "John Doe"
}
```

### Add Service Record
```json
{
  "serviceDate": "2025-01-15",
  "plateNumber": "RAA 123A",
  "serviceCode": 1
}
```

### Add Payment
```json
{
  "amountPaid": 150000,
  "paymentDate": "2025-01-15",
  "plateNumber": "RAA 123A"
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check MySQL is running, verify .env credentials |
| Port 5000 in use | Change PORT in .env or kill process |
| CORS errors | Ensure backend is running, check CORS config |
| Module not found | Run `npm install` again |
| Session not persisting | Check cookies enabled, verify withCredentials |

## File Locations

- ERD: `ERD_DESIGN.txt`
- Database Script: `database_setup.sql`
- Backend Server: `backend-project/server.js`
- Frontend Entry: `frontend-project/src/App.js`
- API Routes: `backend-project/routes/`
- React Components: `frontend-project/src/components/`

## Testing Checklist

- [ ] Database created
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] User registered/logged in
- [ ] Car added
- [ ] Service record created
- [ ] Service record edited
- [ ] Service record deleted
- [ ] Payment added
- [ ] Daily report generated
- [ ] Bill generated and printed

---

**For detailed instructions, see SETUP_INSTRUCTIONS.md**
