import type { OrganizationalUnitEntity } from "../../entities/organizationalunitlist/OrganizationalUnitEntity";

// Repository interface - defines the contract for data access
export interface OrganizationalUnitRepository {
  getAllOrganizationalUnits(): Promise<OrganizationalUnitEntity[]>;
}