-- db/migrations/V1__user_org_unit_access_table.sql

CREATE TABLE tbluser_org_unit_access (
    user_access_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    org_unit_id INT NOT NULL,
    perm_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (org_unit_id) REFERENCES Organizational_Units(org_unit_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) -- Assuming a Users table exists
);