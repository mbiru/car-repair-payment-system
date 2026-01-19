# CRPMS Setup Instructions

## Quick Start Guide

### Step 1: Database Setup (5 minutes)

1. **Open MySQL Command Line or MySQL Workbench**

2. **Run the database setup script**:
   ```bash
   mysql -u root -p < database_setup.sql
   ```
   
   Or in MySQL Workbench:
   - File → Open SQL Script → Select `database_setup.sql`
   - Click Execute (⚡)

3. **Verify installation**:
   ```sql
   USE CRPMS;
   SHOW TABLES;
   SELECT * FROM Services;
   ```
   You should see 6 services pre-populated.

### Step 2: Backend Setup (3 minutes)

1. **Open Terminal/Command Prompt**

2. **Navigate to backend folder**:
   ```bash
   cd backend-project
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure database** (if needed):
   - Edit `.env` file if your MySQL password is not empty
   - Default: `DB_PASSWORD=` (empty)

5. **Start backend server**:
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   ✅ Database connected successfully
   🚀 Server running on http://localhost:5000
   ```

### Step 3: Frontend Setup (3 minutes)

1. **Open a NEW Terminal/Command Prompt**

2. **Navigate to frontend folder**:
   ```bash
   cd frontend-project
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```
   ⚠️ This may take 2-3 minutes

4. **Start frontend server**:
   ```bash
   npm start
   ```
   
   Browser should automatically open at `http://localhost:3000`

### Step 4: Create User Account

**Option 1: Using the Application**
1. The app will redirect to login page
2. Click "Register" (if available) or use API

**Option 2: Using API (Postman/curl)**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

**Option 3: Direct Database Insert**
```sql
-- Generate password hash first, then insert
-- Or use the registration API
```

### Step 5: Login and Test

1. Go to `http://localhost:3000`
2. Login with your credentials
3. Navigate through the application:
   - Add a car
   - Add a service (or use existing)
   - Create a service record
   - Add a payment
   - Generate reports and bills

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution**: 
- Check MySQL is running: `mysql --version`
- Verify credentials in `.env`
- Check database exists: `SHOW DATABASES;`

### Issue: "Port 5000 already in use"
**Solution**:
- Change PORT in `.env` to another port (e.g., 5001)
- Update frontend `AuthContext.js` baseURL accordingly

### Issue: "npm install fails"
**Solution**:
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Issue: "CORS errors"
**Solution**:
- Ensure backend is running
- Check backend CORS configuration allows `http://localhost:3000`
- Verify `withCredentials: true` in axios config

### Issue: "Session not persisting"
**Solution**:
- Check browser cookies are enabled
- Verify `withCredentials: true` in axios
- Check session secret in `.env`

## Testing Checklist

- [ ] Database created successfully
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Can add a car
- [ ] Can add a service
- [ ] Can create a service record
- [ ] Can edit a service record
- [ ] Can delete a service record
- [ ] Can add a payment
- [ ] Can generate daily report
- [ ] Can generate bill
- [ ] Can logout

## Development Commands

### Backend
```bash
npm start          # Production mode
npm run dev        # Development mode with auto-reload
```

### Frontend
```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

## Project Cleanup

When done testing:

1. **Stop both servers** (Ctrl+C in terminals)

2. **Delete project folder**

3. **Drop database**:
   ```sql
   DROP DATABASE CRPMS;
   ```

## Next Steps

1. Review the ERD in `ERD_DESIGN.txt`
2. Explore the API endpoints using Postman
3. Test all CRUD operations
4. Generate sample reports and bills
5. Test responsive design on different screen sizes

---

**Total Setup Time: ~10-15 minutes**
