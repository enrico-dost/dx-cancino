-- db/migrations/V1__unit_types_table.sql

CREATE TABLE tblunit_types (
    unit_type_id INT PRIMARY KEY AUTO_INCREMENT,
    unit_type_name VARCHAR(255) UNIQUE NOT NULL,
    unit_type_descr VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NULL COMMENT 'Foreign key to Users table for the user who created this record',
    updated_by INT NULL COMMENT 'Foreign key to Users table for the user who last updated this record',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);