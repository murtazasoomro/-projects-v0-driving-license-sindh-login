-- ============================================================
-- Driving License Sindh (DLS) - Seed Data
-- Run this AFTER 001-create-tables.sql
-- ============================================================

USE DrivingLicenseSindh;
GO

-- ============================================================
-- Insert Sample Branches
-- (Replace/Add your real branch list here)
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM Branches WHERE BranchCode = 'KHI-CLF-001')
BEGIN
    INSERT INTO Branches (BranchName, BranchCode, Address, Phone, Timings) VALUES
    ('DLS Branch Office - Clifton',   'KHI-CLF-001', 'Block 5, Clifton, Karachi, Sindh',            '+92-21-35874590', 'Mon-Sat: 9:00 AM - 5:00 PM'),
    ('DLS Branch Office - Saddar',    'KHI-SDR-002', 'Saddar Town, Karachi, Sindh',                  '+92-21-35212345', 'Mon-Sat: 9:00 AM - 5:00 PM'),
    ('DLS Branch Office - Nazimabad', 'KHI-NZM-003', 'Nazimabad No. 3, Karachi, Sindh',             '+92-21-36601234', 'Mon-Sat: 9:00 AM - 5:00 PM'),
    ('DLS Branch Office - Hyderabad', 'HYD-CTY-004', 'City Gate, Hyderabad, Sindh',                  '+92-22-27812345', 'Mon-Sat: 9:00 AM - 5:00 PM'),
    ('DLS Branch Office - Sukkur',    'SKR-CTY-005', 'Military Road, Sukkur, Sindh',                 '+92-71-56301234', 'Mon-Sat: 9:00 AM - 5:00 PM'),
    ('DLS Branch Office - Larkana',   'LRK-CTY-006', 'Station Road, Larkana, Sindh',                '+92-74-40501234', 'Mon-Sat: 9:00 AM - 5:00 PM'),
    ('DLS Branch Office - Mirpurkhas','MPK-CTY-007', 'Digri Road, Mirpurkhas, Sindh',               '+92-23-38701234', 'Mon-Sat: 9:00 AM - 5:00 PM'),
    ('DLS Branch Office - Nawabshah', 'NWS-CTY-008', 'Sakrand Road, Shaheed Benazirabad, Sindh',    '+92-24-43601234', 'Mon-Sat: 9:00 AM - 5:00 PM');

    PRINT 'Branches seeded.';
END
GO

-- ============================================================
-- Insert a Default Admin User
-- Username: admin  |  Password: admin
-- In production, change this password immediately!
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, PasswordHash, FullName, BranchId, Role) VALUES
    ('admin', 'admin', 'System Administrator', 1, 'admin');

    PRINT 'Default admin user created (admin / admin).';
END
GO

-- ============================================================
-- Insert Sample Operator Users (one per branch)
-- Password for all: "admin" (replace in production)
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'op.clifton')
BEGIN
    INSERT INTO Users (Username, PasswordHash, FullName, BranchId, Role) VALUES
    ('op.clifton',   'admin', 'Operator Clifton',   1, 'operator'),
    ('op.saddar',    'admin', 'Operator Saddar',    2, 'operator'),
    ('op.nazimabad', 'admin', 'Operator Nazimabad', 3, 'operator'),
    ('op.hyderabad', 'admin', 'Operator Hyderabad', 4, 'operator'),
    ('op.sukkur',    'admin', 'Operator Sukkur',    5, 'operator'),
    ('op.larkana',   'admin', 'Operator Larkana',   6, 'operator'),
    ('op.mirpurkhas','admin', 'Operator Mirpurkhas',7, 'operator'),
    ('op.nawabshah', 'admin', 'Operator Nawabshah', 8, 'operator');

    PRINT 'Sample operators created.';
END
GO

PRINT 'Seed data complete!';
GO
