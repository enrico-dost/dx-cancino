-- db/migrations/V1__organizational_units_table.sql

CREATE TABLE tblorganizational_units (
    org_unit_id INT PRIMARY KEY AUTO_INCREMENT,
    org_unit_name VARCHAR(255) UNIQUE NOT NULL,
    org_unit_descr VARCHAR(255) NULL,
    unit_type_id INT NOT NULL,
    parent_org_unit_id INT NULL,
    region_id INT NOT NULL,
    prov_id INT NOT NULL,
    city_id INT NOT NULL,
    barangay_id INT NOT NULL,
    address VARCHAR(255) NULL,
    latitude DECIMAL(9,11) NULL,
    longitude DECIMAL(9,11) NULL,
    created_by INT NULL COMMENT 'Foreign key to Users table for the user who created this record',
    updated_by INT NULL COMMENT 'Foreign key to Users table for the user who last updated this record',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_type_id) REFERENCES Unit_Types(unit_type_id),
    FOREIGN KEY (parent_org_unit_id) REFERENCES Organizational_Units(org_unit_id),
    FOREIGN KEY (region_id) REFERENCES tblregion(region_id),
    FOREIGN KEY (prov_id) REFERENCES tblprovincial(prov_id),
    FOREIGN KEY (city_id) REFERENCES tblcity(city_id),
    FOREIGN KEY (brgy_id) REFERENCES tblbarangay(brgy_id)
);