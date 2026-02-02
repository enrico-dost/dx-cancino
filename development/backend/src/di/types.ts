// Repository Types
export const TYPES = {
  AgencyRepository: Symbol.for('AgencyRepository'),
  GetAgencyBySectorUseCase: Symbol.for('GetAgencyBySectorUseCase'),
  AgencyController: Symbol.for('AgencyController'),
  DatabaseService: Symbol.for('DatabaseService'),
  
  // Auth Controllers
  AuthController: Symbol.for('AuthController'),
  
  // Organizational Unit
  OrganizationalUnitRepository: Symbol.for('OrganizationalUnitRepository'),
  UpdateOrganizationalUnitUseCase: Symbol.for('UpdateOrganizationalUnitUseCase'),
  OrganizationalUnitController: Symbol.for('OrganizationalUnitController'),
};