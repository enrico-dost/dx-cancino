-- db/migrations/V1__user_org_unit_access_table.sql

CREATE TABLE tbluser_org_unit_access (
    user_access_id SERIAL PRIMARY KEY,
    user_id INT NULL,
    org_unit_id INT NOT NULL,
    perm_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_org_perm UNIQUE (user_id, org_unit_id, perm_id),
    FOREIGN KEY (org_unit_id) REFERENCES tblorganizational_units(org_unit_id)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tbluser_org_unit_access_updated_at
BEFORE UPDATE ON tbluser_org_unit_access
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();