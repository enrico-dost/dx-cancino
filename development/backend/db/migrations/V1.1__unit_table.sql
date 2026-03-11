-- db/migrations/V1__unit_types_table.sql

CREATE TABLE tblunits (
    unit_id SERIAL PRIMARY KEY, -- Unique identifier for each unit
    receiving_officer_id INT NULL, -- Links to tblusers.user_id, identifying the primary contact for the unit
    name VARCHAR(255) NOT NULL, -- The name of the organizational unit
    sequence_order INT, -- The numerical order of the step in the sequence
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- 0: InActive, 1: Active
    org_unit_id INT NOT NULL, -- Foreign key linking to tblorganizational_units.org_unit_id
    created_by INT DEFAULT NULL, -- Audit field for record creator
    updated_by INT DEFAULT NULL, -- Audit field for record updater
    created_at TIMESTAMP NOT NULL DEFAULT NOW(), -- CURRENT_TIMESTAMP ON INSERT
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(), -- CURRENT_TIMESTAMP ON UPDATE

    -- Constraints and Relationships
    FOREIGN KEY (org_unit_id) REFERENCES tblorganizational_units(org_unit_id)
    -- FOREIGN KEY (receiving_officer_id) REFERENCES tblusers(user_id),
    -- FOREIGN KEY (created_by) REFERENCES tblusers(user_id),
    -- FOREIGN KEY (updated_by) REFERENCES tblusers(user_id)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tblunit_updated_at
BEFORE UPDATE ON tblunits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
