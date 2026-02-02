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
  
  // Organization API
  OrganizationalUnitRepository: Symbol.for('OrganizationalUnitRepository'),
  GetAllOrganizationalUnitsUseCase: Symbol.for('GetAllOrganizationalUnitsUseCase'),
  OrganizationalUnitController: Symbol.for('OrganizationalUnitController'),
  
  // Auth
  AuthController: Symbol.for('AuthController'),
};
