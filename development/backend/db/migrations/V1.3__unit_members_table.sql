-- db/migrations/V1__unit_types_table.sql

CREATE TABLE tblunit_members (
    unitmembers_id INT PRIMARY KEY AUTO_INCREMENT, -- Unique identifier for each unit assignment record
    user_id INT NULL, -- Links to tblusers.user_id
    unit_id INT NOT NULL, -- Links to tblunits.unit_id
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- 0: InActive, 1: Active
    created_by INT DEFAULT NULL, -- Audit field for record creator
    updated_by INT DEFAULT NULL, -- Audit field for record updater
    created_at TIMESTAMP NOT NULL DEFAULT NOW(), -- CURRENT_TIMESTAMP ON INSERT
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(), -- CURRENT_TIMESTAMP ON UPDATE

    -- Constraints and Relationships
    -- FOREIGN KEY (user_id) REFERENCES tblusers(user_id),
    FOREIGN KEY (unit_id) REFERENCES tblunits(unit_id)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tblunit_members_updated_at
BEFORE UPDATE ON tblunit_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
