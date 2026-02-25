-- ============================================================
-- Driving License Sindh (DLS) Database Setup
-- Run this script in SQL Server Management Studio (SSMS)
-- ============================================================

-- Step 1: Create the database (skip if it already exists)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DrivingLicenseSindh')
BEGIN
    CREATE DATABASE DrivingLicenseSindh;
END
GO

USE DrivingLicenseSindh;
GO

-- ============================================================
-- Table: Branches
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Branches')
BEGIN
    CREATE TABLE Branches (
        BranchId        INT IDENTITY(1,1) PRIMARY KEY,
        BranchName      NVARCHAR(200)   NOT NULL,
        BranchCode      NVARCHAR(50)    NOT NULL UNIQUE,
        Address         NVARCHAR(500)   NULL,
        Phone           NVARCHAR(50)    NULL,
        Timings         NVARCHAR(200)   NULL,
        IsActive        BIT             NOT NULL DEFAULT 1,
        CreatedAt       DATETIME2       NOT NULL DEFAULT GETDATE()
    );
END
GO

-- ============================================================
-- Table: Users (login accounts linked to a branch)
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserId          INT IDENTITY(1,1) PRIMARY KEY,
        Username        NVARCHAR(100)   NOT NULL UNIQUE,
        PasswordHash    NVARCHAR(500)   NOT NULL,
        FullName        NVARCHAR(200)   NOT NULL,
        BranchId        INT             NOT NULL,
        Role            NVARCHAR(50)    NOT NULL DEFAULT 'operator',
        IsActive        BIT             NOT NULL DEFAULT 1,
        CreatedAt       DATETIME2       NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Users_Branch FOREIGN KEY (BranchId) REFERENCES Branches(BranchId)
    );
END
GO

-- ============================================================
-- Table: Sessions (operator work sessions)
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Sessions')
BEGIN
    CREATE TABLE Sessions (
        SessionId       INT IDENTITY(1,1) PRIMARY KEY,
        UserId          INT             NOT NULL,
        BranchId        INT             NOT NULL,
        StartTime       DATETIME2       NOT NULL DEFAULT GETDATE(),
        EndTime         DATETIME2       NULL,
        IsActive        BIT             NOT NULL DEFAULT 1,
        CreatedAt       DATETIME2       NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Sessions_User   FOREIGN KEY (UserId)   REFERENCES Users(UserId),
        CONSTRAINT FK_Sessions_Branch FOREIGN KEY (BranchId) REFERENCES Branches(BranchId)
    );
END
GO

-- ============================================================
-- Table: Tokens (issued tokens)
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tokens')
BEGIN
    CREATE TABLE Tokens (
        TokenId         INT IDENTITY(1,1) PRIMARY KEY,
        TokenNumber     NVARCHAR(20)    NOT NULL,
        DocType         NVARCHAR(10)    NOT NULL,        -- 'cnic' or 'passport'
        DocNumber       NVARCHAR(50)    NOT NULL,
        ServiceType     NVARCHAR(20)    NOT NULL,        -- 'learner', 'permanent', 'international'
        ServicePrefix   NVARCHAR(5)     NOT NULL,        -- 'L', 'P', 'I'
        TokenType       NVARCHAR(20)    NOT NULL,        -- 'normal' or 'fast-track'
        TokenTypeNumber INT             NOT NULL,        -- 1 = Normal, 2 = Fast Track
        Counter         NVARCHAR(50)    NOT NULL,
        SessionId       INT             NOT NULL,
        BranchId        INT             NOT NULL,
        IssuedBy        INT             NOT NULL,        -- UserId
        IssuedAt        DATETIME2       NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Tokens_Session FOREIGN KEY (SessionId) REFERENCES Sessions(SessionId),
        CONSTRAINT FK_Tokens_Branch  FOREIGN KEY (BranchId)  REFERENCES Branches(BranchId),
        CONSTRAINT FK_Tokens_User    FOREIGN KEY (IssuedBy)  REFERENCES Users(UserId)
    );
END
GO

-- ============================================================
-- Indexes for performance
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tokens_DocNumber')
    CREATE INDEX IX_Tokens_DocNumber ON Tokens(DocNumber);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tokens_SessionId')
    CREATE INDEX IX_Tokens_SessionId ON Tokens(SessionId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tokens_BranchId')
    CREATE INDEX IX_Tokens_BranchId ON Tokens(BranchId);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Sessions_UserId')
    CREATE INDEX IX_Sessions_UserId ON Sessions(UserId);
GO

PRINT 'All tables created successfully!';
GO
