import { injectable, inject } from 'inversify';
import type { Pool } from 'pg';
import type { OrganizationalUnitRepository } from '../../../domain/repositories/organizationalunitlist/OrganizationalUnitRepository';
import type { OrganizationalUnitEntity } from '../../../domain/entities/organizationalunitlist/OrganizationalUnitEntity';
import { TYPES } from '../../../di/types';

// Internal database row structure
interface OrganizationalUnitRow {
  org_unit_id: number;
  org_unit_name: string;
  address: string | null;
  brgy_id: number | null;
  city_id: number | null;
  prov_id: number | null;
  region_id: number | null;
  unit_type: string;
  parent_unit_name: string | null;
}

// Geo service response interfaces
interface GeoDataResponse {
  name?: string;
}

@injectable()
export class OrganizationalUnitRepositoryImp implements OrganizationalUnitRepository {
  // You should set this in your environment variables
  private readonly GEO_SERVICE_BASE_URL = process.env.GEO_SERVICE_URL || 'http://localhost:3001/api';

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
          ou.brgy_id,
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

      const result = await this.pool.query<OrganizationalUnitRow>(query);

      // If no data found, return empty array
      if (result.rows.length === 0) {
        return [];
      }

      // Step 2: Enrich each organizational unit with location data
      const enrichedUnits = await Promise.all(
        result.rows.map(async (row) => {
          const completeAddress = await this.buildCompleteAddress(row);
          
          return {
            org_unit_id: row.org_unit_id,
            org_unit_name: row.org_unit_name,
            parent_unit_name: row.parent_unit_name,
            unit_type: row.unit_type,
            complete_address: completeAddress,
          };
        })
      );

      return enrichedUnits;
    } catch (error) {
      console.error('Error fetching organizational units:', error);
      throw new Error('Failed to fetch organizational units data');
    }
  }

  /**
   * Builds the complete address by calling the Geo Data Service
   * Format: "Region name, Provincial Name, City name, barangay name, address/street"
   */
  private async buildCompleteAddress(row: OrganizationalUnitRow): Promise<string> {
    try {
      const addressParts: string[] = [];

      // Fetch location names from Geo Data Service in parallel
      const [region, province, city, barangay] = await Promise.all([
        row.region_id ? this.fetchGeoData('region', row.region_id) : null,
        row.prov_id ? this.fetchGeoData('province', row.prov_id) : null,
        row.city_id ? this.fetchGeoData('city', row.city_id) : null,
        row.brgy_id ? this.fetchGeoData('barangay', row.brgy_id) : null,
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

  /**
   * Fetches geo data from the external Geo Data Service
   */
  private async fetchGeoData(type: 'region' | 'province' | 'city' | 'barangay', id: number): Promise<GeoDataResponse | null> {
    try {
      const url = `${this.GEO_SERVICE_BASE_URL}/${type}/${id}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed by your geo service
          // 'Authorization': `Bearer ${process.env.GEO_SERVICE_TOKEN}`,
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