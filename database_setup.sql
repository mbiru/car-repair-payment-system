-- ============================================================================
-- CAR REPAIR PAYMENT MANAGEMENT SYSTEM (CRPMS) - DATABASE SETUP
-- Database: MySQL
-- ============================================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS CRPMS;
USE CRPMS;

-- ============================================================================
-- TABLE: User
-- Purpose: Store user authentication information
-- ============================================================================
CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL COMMENT 'bcrypt encrypted password',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- TABLE: Car
-- Purpose: Store car information
-- ============================================================================
CREATE TABLE IF NOT EXISTS Car (
    PlateNumber VARCHAR(20) PRIMARY KEY,
    Type VARCHAR(50),
    Model VARCHAR(50),
    ManufacturingYear INT,
    DriverPhone VARCHAR(20),
    MechanicName VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- TABLE: Services
-- Purpose: Store available services and their prices
-- ============================================================================
CREATE TABLE IF NOT EXISTS Services (
    ServiceCode INT AUTO_INCREMENT PRIMARY KEY,
    ServiceName VARCHAR(100) NOT NULL,
    ServicePrice DECIMAL(10,2) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- TABLE: ServiceRecord
-- Purpose: Store service records linking cars and services
-- ============================================================================
CREATE TABLE IF NOT EXISTS ServiceRecord (
    RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
    ServiceDate DATE NOT NULL,
    PlateNumber VARCHAR(20) NOT NULL,
    ServiceCode INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber) ON DELETE CASCADE,
    FOREIGN KEY (ServiceCode) REFERENCES Services(ServiceCode) ON DELETE CASCADE,
    INDEX idx_plate (PlateNumber),
    INDEX idx_service (ServiceCode),
    INDEX idx_date (ServiceDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- TABLE: Payment
-- Purpose: Store payment records for cars
-- ============================================================================
CREATE TABLE IF NOT EXISTS Payment (
    PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
    AmountPaid DECIMAL(10,2) NOT NULL,
    PaymentDate DATE NOT NULL,
    PlateNumber VARCHAR(20) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber) ON DELETE CASCADE,
    INDEX idx_plate (PlateNumber),
    INDEX idx_date (PaymentDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- PREPOPULATE SERVICES TABLE
-- ============================================================================
INSERT INTO Services (ServiceName, ServicePrice) VALUES
('Engine repair', 150000.00),
('Transmission repair', 80000.00),
('Oil Change', 60000.00),
('Chain replacement', 40000.00),
('Disc replacement', 400000.00),
('Wheel alignment', 5000.00);

-- ============================================================================
-- CREATE DEFAULT ADMIN USER (Password: Admin@123)
-- Password hash for 'Admin@123' using bcrypt
-- ============================================================================
INSERT INTO User (Username, Password) VALUES
('admin', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq');

-- Note: The above password hash is a placeholder. In production, use bcrypt
-- to generate the hash. For testing, you can register a new user through
-- the application or use: bcrypt.hashSync('Admin@123', 10)

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- SELECT * FROM Services;
-- SELECT * FROM User;
-- SELECT * FROM Car;
-- SELECT * FROM ServiceRecord;
-- SELECT * FROM Payment;
