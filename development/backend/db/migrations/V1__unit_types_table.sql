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

INSERT INTO tblunit_types (unit_type_id, unit_type_name, unit_type_descr, is_active) VALUES
(1, 'Agency', 'A primary government body or department.', TRUE),
(2, 'Regional Office', 'An administrative unit overseeing a specific geographical region.', TRUE),
(3, 'Provincial Office', 'A subordinate office operating within a specific province.', TRUE),
(4, 'City Office', 'A subordinate office operating within a specific city or municipality.', TRUE),
(5, 'Department', 'A functional division within an agency or office.', TRUE),
(6, 'Division', 'A smaller operational unit within a department.', TRUE),
(7, 'Branch', 'A localized sub-unit of an office.', TRUE),
(8, 'Field Office', 'A unit operating directly in a specific field or area.', TRUE),
(9, 'Office', 'A high-level administrative unit or leadership office.', TRUE),
(10, 'Service', 'A functional division providing support and specialized services.', TRUE),
(11, 'Regional Office', 'An office that manages S&T programs for a specific region.', TRUE);