import type { AgencyModel } from '../../models/agency/AgencyModel';
import type { AgencyEntity, AgencySectorEntity } from '../../../domain/entities/agency/AgencyEntity';

export class agencyMapper {
  static toEntity(model: AgencyModel): AgencyEntity {
    return {
      org_unit_id: model.org_unit_id,
      org_unit_name: model.org_unit_name,
      parent_org_unit_id: model.parent_org_unit_id
    };
  }

  static toSectorEntity(sectors: AgencyModel[]): AgencySectorEntity[] {
    const sectorMap = new Map<number, AgencySectorEntity>();
    const parentSectors = new Map<number, AgencyModel>();
    
    // First, identify parent sectors (those with no parent or parent is different)
    sectors.forEach(agency => {
      const parentId = agency.parent_org_unit_id;
      
      // If this agency has a parent, store the parent
      if (parentId && parentId !== 0) {
        const parentAgency = sectors.find(s => s.org_unit_id === parentId);
        if (parentAgency && !parentSectors.has(parentId)) {
          parentSectors.set(parentId, parentAgency);
        }
      }
    });
    
    // Group agencies by their parent sectors
    sectors.forEach(agency => {
      const parentId = agency.parent_org_unit_id;
      
      // Skip if this is a parent sector itself
      if (parentSectors.has(agency.org_unit_id)) {
        return;
      }
      
      // Only process agencies that have a parent sector
      if (parentId && parentSectors.has(parentId)) {
        if (!sectorMap.has(parentId)) {
          const parentAgency = parentSectors.get(parentId)!;
          sectorMap.set(parentId, {
            org_unit_id: parentId,
            org_unit_name: parentAgency.org_unit_name,
            agencies: []
          });
        }
        
        const sector = sectorMap.get(parentId)!;
        sector.agencies.push(this.toEntity(agency));
      }
    });
    
    return Array.from(sectorMap.values());
  }
}
