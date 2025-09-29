-- db/migrations/V1__organizational_units_table.sql

CREATE TABLE tblorganizational_units (
    org_unit_id SERIAL PRIMARY KEY,
    org_unit_name VARCHAR(255) UNIQUE NOT NULL,
    org_unit_descr VARCHAR(255) NULL,
    unit_type_id INT NOT NULL,
    parent_org_unit_id INT NULL,
    region_id INT NULL,
    prov_id INT NULL,
    city_id INT NULL,
    barangay_id INT NULL,
    address VARCHAR(255) NULL,
    latitude DECIMAL(9,11) NULL,
    longitude DECIMAL(9,11) NULL,
    created_by INT NULL,
    updated_by INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (unit_type_id) REFERENCES tblunit_types(unit_type_id),
    FOREIGN KEY (parent_org_unit_id) REFERENCES tblorganizational_units(org_unit_id)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tblorganizational_units_updated_at
BEFORE UPDATE ON tblorganizational_units
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

INSERT INTO tblorganizational_units (org_unit_id, org_unit_name, org_unit_descr, unit_type_id, parent_org_unit_id, region_id, prov_id, city_id, brgy_id) VALUES
-- Parent: Sectoral Planning Councils (org_unit_id = 101)
(101, 'Sectoral Planning Councils', 'A coordinating body for various sectoral research councils under DOST.', 1, NULL, 1, 1, 16, 1),
(102, 'PCAARRD', 'Philippine Council for Agriculture, Aquatic and Natural Resources Research and Development.', 1, 101, 6, 26, 95, 1),
(103, 'PCHRD', 'Philippine Council for Health Research and Development.', 1, 101, 1, 1, 16, 1),
(104, 'PCIEERD', 'Philippine Council for Industry, Energy and Emerging Technology Research and Development.', 1, 101, 1, 1, 16, 1),

-- Ultimate Parent: Department of Science and Technology (DOST) (org_unit_id = 105)
(105, 'Department of Science and Technology', 'The primary science and technology body of the Philippine government.', 1, NULL, 1, 1, 16, 1),

-- Top-level offices under DOST (Parent ID: 105)
(106, 'OFFICE OF THE SECRETARY', 'The primary office of the DOST Secretary.', 9, 105, 1, 1, 16, 1),
(107, 'OFFICE OF THE UNDERSECRETARY FOR SCIENTIFIC AND TECHNICAL SERVICES (OUSEC-STS)', 'Office of the Undersecretary for Scientific and Technical Services.', 9, 105, 1, 1, 16, 1),
(108, 'OFFICE OF THE UNDERSECRETARY FOR RESEARCH AND DEVELOPMENT (OUSEC-RD)', 'Office of the Undersecretary for Research and Development.', 9, 105, 1, 1, 16, 1),
(109, 'OFFICE OF THE UNDERSECRETARY FOR REGIONAL OPERATIONS (OUSEC-RO)', 'Office of the Undersecretary for Regional Operations.', 9, 105, 1, 1, 16, 1),
(110, 'OFFICE OF THE UNDERSECRETARY FOR SPECIAL CONCERNS (OUSEC-SC)', 'Office of the Undersecretary for Special Concerns.', 9, 105, 1, 1, 16, 1),
(111, 'OFFICE OF THE ASSISTANT SECRETARY FOR TECHNOLOGY TRANSFER, COMMUNICATIONS, AND COMMERCIALIZATION (OASEC-TTCC)', 'Office of the Assistant Secretary for Technology Transfer, Communications, and Commercialization.', 9, 105, 1, 1, 16, 1),
(112, 'OFFICE OF THE ASSISTANT SECRETARY FOR ADMINISTRATIVE AND LEGAL AFFAIRS (OASEC-ALA)', 'Office of the Assistant Secretary for Administrative and Legal Affairs.', 9, 105, 1, 1, 16, 1),
(113, 'OFFICE OF THE ASSISTANT SECRETARY FOR DEVELOPMENT COOPERATION (OASEC-DC)', 'Office of the Assistant Secretary for Development Cooperation.', 9, 105, 1, 1, 16, 1),

-- Units under OFFICE OF THE SECRETARY (Parent ID: 106)
(114, 'PLANNING AND EVALUATION SERVICE (PES)', 'Service responsible for planning and evaluation.', 10, 106, 1, 1, 16, 1),
(115, 'INTERNAL AUDIT SERVICE (IAS)', 'Service responsible for internal audits.', 10, 106, 1, 1, 16, 1),
(116, 'Disaster Risk Reduction and Climate Change Unit (DRRCCU)', 'Unit focused on disaster risk reduction and climate change.', 7, 106, 1, 1, 16, 1),

-- Divisions under PLANNING AND EVALUATION SERVICE (PES) (Parent ID: 114)
(117, 'Policy Development and Planning Division (PDPD)', 'Division for policy development and planning.', 6, 114, 1, 1, 16, 1),
(118, 'Program Coordination and Monitoring Division (PCMD)', 'Division for program coordination and monitoring.', 6, 114, 1, 1, 16, 1),
(119, 'S&T Resource Assessment and Evaluation Division (STRAED)', 'Division for S&T resource assessment and evaluation.', 6, 114, 1, 1, 16, 1),
(120, 'Information Technology Division (ITD)', 'Division for information technology services.', 6, 114, 1, 1, 16, 1),

-- Divisions under INTERNAL AUDIT SERVICE (IAS) (Parent ID: 115)
(121, 'Operations and Audit Division (OpAD)', 'Division for operations and audit.', 6, 115, 1, 1, 16, 1),
(122, 'Management Audit Division (MAuD)', 'Division for management audit.', 6, 115, 1, 1, 16, 1),

-- Units under OFFICE OF THE UNDERSECRETARY FOR SCIENTIFIC AND TECHNICAL SERVICES (OUSEC-STS) (Parent ID: 107)
(123, 'FINANCIAL AND MANAGEMENT SERVICE (FMS)', 'Service for financial and management support.', 10, 107, 1, 1, 16, 1),
(124, 'Technology Resource Center (TRC)', 'Center for technology resources.', 1, 107, 1, 1, 16, 1),
(125, 'Health Technology Assessment (HTA) Division', 'Division for health technology assessment.', 6, 107, 1, 1, 16, 1),

-- Divisions under FINANCIAL AND MANAGEMENT SERVICE (FMS) (Parent ID: 123)
(126, 'Budget Division (BD)', 'Division for budget management.', 6, 123, 1, 1, 16, 1),
(127, 'Accounting Division (AD)', 'Division for accounting services.', 6, 123, 1, 1, 16, 1),
(128, 'Management Division (MD)', 'Division for management services.', 6, 123, 1, 1, 16, 1),

-- Units under OFFICE OF THE UNDERSECRETARY FOR RESEARCH AND DEVELOPMENT (OUSEC-RD) (Parent ID: 108)
(129, 'International Technology Cooperation Unit (ITCU)', 'Unit for international technology cooperation.', 7, 108, 1, 1, 16, 1),
(130, 'Special Projects Division (SPD)', 'Division for special projects.', 6, 108, 1, 1, 16, 1),

-- Units under OFFICE OF THE UNDERSECRETARY FOR REGIONAL OPERATIONS (OUSEC-RO) (Parent ID: 109)
(131, 'Regional Offices (ROs)', 'Unit for regional offices.', 9, 109, 1, 1, 16, 1),
(132, 'Provincial Science and Technology Offices (PSTOs)', 'Unit for provincial S&T offices.', 9, 109, 1, 1, 16, 1),
(133, 'Science and Technology Foundation Unit (SFU)', 'Unit for the S&T foundation.', 7, 109, 1, 1, 16, 1),

-- Units under OFFICE OF THE ASSISTANT SECRETARY FOR ADMINISTRATIVE AND LEGAL AFFAIRS (OASEC-ALA) (Parent ID: 112)
(134, 'ADMINISTRATIVE AND LEGAL SERVICE (ALS)', 'Service for administrative and legal affairs.', 10, 112, 1, 1, 16, 1),

-- Divisions under ADMINISTRATIVE AND LEGAL SERVICE (ALS) (Parent ID: 134)
(135, 'General Services Division (GSD)', 'Division for general services.', 6, 134, 1, 1, 16, 1),
(136, 'Personnel Division (PD)', 'Division for personnel management.', 6, 134, 1, 1, 16, 1),
(137, 'Procurement Management Division (PMD)', 'Division for procurement management.', 6, 134, 1, 1, 16, 1),
(138, 'Gender and Development Unit (GADU)', 'Unit for gender and development.', 7, 134, 1, 1, 16, 1),

-- Children of Research and Development Institutes (org_unit_id = 153)
(139, 'Advanced Science and Technology Institute (ASTI)', 'Focuses on R&D in advanced technologies.', 1, 153, 1, 1, 16, 1),
(140, 'Food and Nutrition Research Institute (FNRI)', 'The lead agency in food and nutrition research.', 1, 153, 1, 1, 16, 1),
(141, 'Forest Products Research and Development Institute (FPRDI)', 'Focuses on the optimal utilization of forest products.', 1, 153, 6, 26, 95, 1),
(142, 'Industrial Technology Development Institute (ITDI)', 'Develops and transfers industrial technologies.', 1, 153, 1, 1, 16, 1),
(143, 'Metals Industry Research and Development Center (MIRDC)', 'Provides R&D and support services to the metals industry.', 1, 153, 1, 1, 16, 1),
(144, 'Philippine Nuclear Research Institute (PNRI)', 'The national atomic energy research institution.', 1, 153, 1, 1, 16, 1),
(145, 'Philippine Textile Research Institute (PTRI)', 'Engages in textile research and development.', 1, 153, 1, 1, 16, 1),

-- Children of Scientific and Technological Services (org_unit_id = 155)
(146, 'Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA)', 'Provides weather and climate information and services.', 1, 155, 1, 1, 16, 1),
(147, 'Philippine Institute of Volcanology and Seismology (PHIVOLCS)', 'Monitors and studies volcanoes, earthquakes, and tsunamis.', 1, 155, 1, 1, 16, 1),
(148, 'Science and Technology Information Institute (STII)', 'The information and marketing arm of the DOST.', 1, 155, 1, 1, 16, 1),
(150, 'Philippine Science High School System (PSHSS)', 'A system of high schools specializing in science and technology.', 1, 155, 1, 1, 16, 1),
(151, 'Philippine Science High School - Main Campus', 'The main campus of the PSHS System.', 1, 150, 1, 1, 16, 1),
(152, 'Technology Application and Promotion Institute (TAPI)', 'The marketing arm of the DOST.', 1, 155, 1, 1, 16, 1),
(154, 'Science Education Institute (SEI)', 'Manages and implements the country’s science and technology education.', 1, 155, 1, 1, 16, 1),

-- Children of Collegial and Scientific Bodies (org_unit_id = 157)
(149, 'National Research Council of the Philippines (NRCP)', 'A collegial body of researchers and scientists.', 1, 157, 1, 1, 16, 1),
(156, 'National Academy of Science and Technology (NAST)', 'The country’s highest recognition body for science and technology.', 1, 157, 1, 1, 16, 1),

-- New Parent Units
(153, 'Research and Development Institutes', 'A conceptual grouping of DOST’s attached R&D institutes.', 9, 105, 1, 1, 16, 1),
(155, 'Scientific and Technological Services', 'A conceptual grouping of DOST’s scientific and technological service agencies.', 9, 105, 1, 1, 16, 1),
(157, 'Collegial and Scientific Bodies', 'A conceptual grouping of DOST’s collegial and scientific bodies.', 9, 105, 1, 1, 16, 1),

-- DOST Regional Offices (Parent ID: 109)
(158, 'DOST-CAR', 'DOST Cordillera Administrative Region Office', 2, 109, 2, 4, 52, 1),
(159, 'DOST-Region I', 'DOST Ilocos Region Office', 2, 109, 3, 11, 108, 1),
(160, 'DOST-Region II', 'DOST Cagayan Valley Office', 2, 109, 4, 14, 154, 1),
(161, 'DOST-Region III', 'DOST Central Luzon Office', 2, 109, 5, 21, 219, 1),
(162, 'DOST-Region IV-A', 'DOST CALABARZON Office', 2, 109, 6, 26, 252, 1),
(163, 'DOST-Region IV-B', 'DOST MIMAROPA Office', 2, 109, 7, 31, 303, 1),
(164, 'DOST-Region V', 'DOST Bicol Region Office', 2, 109, 8, 34, 321, 1),
(165, 'DOST-Region VI', 'DOST Western Visayas Office', 2, 109, 9, 44, 477, 1),
(166, 'DOST-Region VII', 'DOST Central Visayas Office', 2, 109, 10, 47, 513, 1),
(167, 'DOST-Region VIII', 'DOST Eastern Visayas Office', 2, 109, 11, 52, 609, 1),
(168, 'DOST-Region IX', 'DOST Zamboanga Peninsula Office', 2, 109, 12, 57, 650, 1),
(169, 'DOST-Region X', 'DOST Northern Mindanao Office', 2, 109, 13, 63, 715, 1),
(170, 'DOST-Region XI', 'DOST Davao Region Office', 2, 109, 14, 66, 755, 1),
(171, 'DOST-Region XII', 'DOST SOCCSKSARGEN Office', 2, 109, 15, 71, 807, 1),
(172, 'DOST-Region XIII', 'DOST Caraga Office', 2, 109, 16, 76, 856, 1),
(173, 'DOST-BARMM', 'DOST Bangsamoro Autonomous Region in Muslim Mindanao Office', 2, 109, 17, 79, 874, 1);