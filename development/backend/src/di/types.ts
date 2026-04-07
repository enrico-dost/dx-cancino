/**
 * Dependency Injection Types
 * Centralized symbol registry for all API modules
 * Scalable structure for adding new APIs
 */
export const TYPES = {
  // Database
  databaseService: Symbol.for('databaseService'),
  DatabasePool: Symbol.for('DatabasePool'),
  
  // Agency API
  AgencyRepository: Symbol.for('AgencyRepository'),
  getAgencyBySectorUseCase: Symbol.for('getAgencyBySectorUseCase'),
  agencyController: Symbol.for('agencyController'),
  
  // Organization List API
  OrganizationalUnitRepository: Symbol.for('OrganizationalUnitRepository'),
  getAllOrganizationalUnitsUseCase: Symbol.for('getAllOrganizationalUnitsUseCase'),
  organizationalUnitController: Symbol.for('organizationalUnitController'),
  
  // Update Organizational Unit API
  UpdateOrganizationalUnitRepository: Symbol.for('UpdateOrganizationalUnitRepository'),
  updateOrganizationalUnitUseCase: Symbol.for('updateOrganizationalUnitUseCase'),
  UpdateOrganizationalUnitController: Symbol.for('UpdateOrganizationalUnitController'),
  
  // Unit Type API
  UnitTypeRepository: Symbol.for("UnitTypeRepository"),
  GetAllUnitTypesUseCase: Symbol.for("GetAllUnitTypesUseCase"),
  UnitTypeController: Symbol.for("UnitTypeController"),

  // User Organizational Unit Access API Module
  UserOrgUnitAccessRepository: Symbol.for("UserOrgUnitAccessRepository"),
  UpsertUserOrgUnitAccessUseCase: Symbol.for("UpsertUserOrgUnitAccessUseCase"),
  GetUserOrgUnitAccessByUserUseCase: Symbol.for("GetUserOrgUnitAccessByUserUseCase"),
  UserOrgUnitAccessController: Symbol.for("UserOrgUnitAccessController"),

  // Edit Unit Type API
  EditUnitTypeUseCase: Symbol.for("EditUnitTypeUseCase"),
  EditUnitTypeController: Symbol.for("EditUnitTypeController"),

  // Implementing Agency API
  ImplementingAgencyRepository: Symbol.for("ImplementingAgencyRepository"),
  getImplementingAgenciesByUnitTypeUseCase: Symbol.for("getImplementingAgenciesByUnitTypeUseCase"),
  implementingAgencyController: Symbol.for("implementingAgencyController"),
  
  // Auth
  authController: Symbol.for('authController'),
};