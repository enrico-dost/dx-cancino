-- db/migrations/V1__unit_types_table.sql

CREATE TABLE tblunit_types (
    unit_type_id SERIAL PRIMARY KEY,
    unit_type_name VARCHAR(255) UNIQUE NOT NULL,
    unit_type_descr VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NULL,
    updated_by INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tblunit_types_updated_at
BEFORE UPDATE ON tblunit_types
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

INSERT INTO tblunit_types (unit_type_name, unit_type_descr) VALUES
( 'Agency', 'A primary government body or department.'),
( 'Regional Office', 'An administrative unit overseeing a specific geographical region.'),
( 'Provincial Office', 'A subordinate office operating within a specific province.'),
( 'City Office', 'A subordinate office operating within a specific city or municipality.'),
( 'Department', 'A functional division within an agency or office.'),
( 'Division', 'A smaller operational unit within a department.'),
( 'Branch', 'A localized sub-unit of an office.'),
( 'Field Office', 'A unit operating directly in a specific field or area.'),
( 'Office', 'A high-level administrative unit or leadership office.'),
( 'Service', 'A functional division providing support and specialized services.'),
( 'Regional Office', 'An office that manages S&T programs for a specific region.');