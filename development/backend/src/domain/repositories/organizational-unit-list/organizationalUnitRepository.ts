import type { OrganizationalUnitEntity } from "../../entities/organizational-unit-list/organizationalUnitEntity";

// Repository interface - defines the contract for data access
export interface OrganizationalUnitRepository {
  getAllOrganizationalUnits(): Promise<OrganizationalUnitEntity[]>;
}