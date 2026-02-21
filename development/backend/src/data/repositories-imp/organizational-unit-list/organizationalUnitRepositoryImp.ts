import { injectable, inject } from 'inversify';
import type { Pool } from 'pg';
import type { OrganizationalUnitRepository } from '../../../domain/repositories/organizational-unit-list/organizationalUnitRepository';
import type { OrganizationalUnitEntity } from '../../../domain/entities/organizational-unit-list/organizationalUnitEntity';
import type { OrganizationalUnitModel } from '../../models/organizational-unit-list/organizationalUnitModel';
import { organizationalUnitMapper } from '../../mappers/organizational-unit-list/organizationalUnitMapper';
import { TYPES } from '../../../di/types';

// Geo service response interfaces
interface GeoDataResponse {
  name?: string;
}

@injectable()
export class organizationalUnitRepositoryImp implements OrganizationalUnitRepository {
  // You should set this in your environment variables
  private readonly GEO_SERVICE_BASE_URL = process.env.GEO_SERVICE_URL || 'http://localhost:8004/api';

  constructor(
    @inject(TYPES.DatabasePool) private pool: Pool
  ) {}

  async getAllOrganizationalUnits(): Promise<OrganizationalUnitEntity[]> {
    try {
      // Step 1: Get all organizational units from database
      const query = `
        SELECT
          ou.org_unit_id,
          ou.org_unit_name,
          ou.address,
          ou.barangay_id,
          ou.city_id,
          ou.prov_id,
          ou.region_id,
          ut.unit_type_name AS unit_type,
          parent.org_unit_name AS parent_unit_name
        FROM
          tblorganizational_units AS ou
        LEFT JOIN
          tblunit_types AS ut ON ou.unit_type_id = ut.unit_type_id
        LEFT JOIN
          tblorganizational_units AS parent ON ou.parent_org_unit_id = parent.org_unit_id
        ORDER BY ou.org_unit_id;
      `;

      const result = await this.pool.query<OrganizationalUnitModel>(query);

      if (result.rows.length === 0) {
        return [];
      }

      const addressMap = new Map<number, string>();
      await Promise.all(
        result.rows.map(async (row) => {
          const completeAddress = await this.buildCompleteAddress(row);
          addressMap.set(row.org_unit_id, completeAddress);
        })
      );

      const entities = organizationalUnitMapper.toEntities(result.rows, addressMap);

      return entities;
    } catch (error) {
      console.error('Error fetching organizational units:', error);
      throw new Error('Failed to fetch organizational units data');
    }
  }

  private async buildCompleteAddress(row: OrganizationalUnitModel): Promise<string> {
    try {
      const addressParts: string[] = [];

      // Fetch location names from Geo Data Service in parallel
      const [region, province, city, barangay] = await Promise.all([
        row.region_id ? this.fetchGeoData('region', row.region_id) : null,
        row.prov_id ? this.fetchGeoData('province', row.prov_id) : null,
        row.city_id ? this.fetchGeoData('city', row.city_id) : null,
        row.barangay_id ? this.fetchGeoData('barangay', row.barangay_id) : null,
      ]);

      // Build address parts in the required order
      if (region?.name) addressParts.push(region.name);
      if (province?.name) addressParts.push(province.name);
      if (city?.name) addressParts.push(city.name);
      if (barangay?.name) addressParts.push(barangay.name);
      if (row.address) addressParts.push(row.address);

      return addressParts.join(', ');
    } catch (error) {
      console.error(`Error building address for org unit ${row.org_unit_id}:`, error);
      // Return the street address only if geo service fails
      return row.address || '';
    }
  }

  private async fetchGeoData(type: 'region' | 'province' | 'city' | 'barangay', id: number): Promise<GeoDataResponse | null> {
    try {
      const url = `${this.GEO_SERVICE_BASE_URL}/${type}/${id}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

        },
      });

      if (!response.ok) {
        console.warn(`Geo service returned ${response.status} for ${type} ${id}`);
        return null;
      }

      const data = await response.json() as GeoDataResponse;
      return data;
    } catch (error) {
      console.error(`Error fetching ${type} data for ID ${id}:`, error);
      return null;
    }
  }
}