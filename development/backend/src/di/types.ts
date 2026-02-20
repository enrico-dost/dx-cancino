/**
 * Dependency Injection Types
 * Centralized symbol registry for all API modules
 * Scalable structure for adding new APIs
 */
export const TYPES = {
  // Database
  DatabaseService: Symbol.for('DatabaseService'),
  DatabasePool: Symbol.for('DatabasePool'),
  
  // Agency API
  AgencyRepository: Symbol.for('AgencyRepository'),
  GetAgencyBySectorUseCase: Symbol.for('GetAgencyBySectorUseCase'),
  AgencyController: Symbol.for('AgencyController'),
  
  // Organization List API
  OrganizationalUnitRepository: Symbol.for('OrganizationalUnitRepository'),
  GetAllOrganizationalUnitsUseCase: Symbol.for('GetAllOrganizationalUnitsUseCase'),
  OrganizationalUnitController: Symbol.for('OrganizationalUnitController'),
  
  // Update Organizational Unit API
  UpdateOrganizationalUnitRepository: Symbol.for('UpdateOrganizationalUnitRepository'),
  UpdateOrganizationalUnitUseCase: Symbol.for('UpdateOrganizationalUnitUseCase'),
  UpdateOrganizationalUnitController: Symbol.for('UpdateOrganizationalUnitController'),
  
  // Unit Type API
  UnitTypeRepository: Symbol.for("UnitTypeRepository"),
  GetAllUnitTypesUseCase: Symbol.for("GetAllUnitTypesUseCase"),
  UnitTypeController: Symbol.for("UnitTypeController"),

  // Auth
  AuthController: Symbol.for('AuthController'),
};