import type { AgencyModel } from '../../models/agency-by-sector/agencyModel';
import type { AgencyEntity } from '../../../domain/entities/agency-by-sector/agencyEntity';

export class agencyMapper {
  static toEntity(model: AgencyModel): AgencyEntity {
    return {
      org_unit_id: model.org_unit_id,
      org_unit_name: model.org_unit_name,
      parent_org_unit_id: model.parent_org_unit_id,
      sector_name: model.sector_name
    };
  }

  static toEntityList(models: AgencyModel[]): AgencyEntity[] {
    return models.map((model) => this.toEntity(model));
  }
}
