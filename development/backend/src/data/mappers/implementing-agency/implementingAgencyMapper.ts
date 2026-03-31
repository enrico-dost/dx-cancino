import type { ImplementingAgencyModel } from '../../models/implementing-agency/implementingAgencyModel';
import type { ImplementingAgencyEntity } from '../../../domain/entities/implementing-agency/implementingAgencyEntity';

/**
 * Implementing Agency Mapper
 * Converts database models to domain entities
 * Extracts abbreviations from full organization names
 */
export class implementingAgencyMapper {
    /**
     * Extract abbreviation from organization name
     * Format: "Full Name (ABBREVIATION)" -> "ABBREVIATION"
     * If not found, returns the original name
     */
    private static extractAbbreviation(fullName: string): string {
        const match = fullName.match(/\(([A-Z]+)\)$/);
        const abbreviation: string = match ? match[1]! : fullName;
        
        // Handle specific cases where abbreviation needs adjustment
        if (abbreviation === 'PSHSS') {
            return 'PSHS';
        }
        
        return abbreviation;
    }

    /**
     * Convert a database model to entity
     */
    static toEntity(model: ImplementingAgencyModel): ImplementingAgencyEntity {
        return {
            org_unit_id: model.org_unit_id,
            org_unit_name: this.extractAbbreviation(model.org_unit_name)
        };
    }

    /**
     * Convert multiple database models to entities
     */
    static toEntityList(models: ImplementingAgencyModel[]): ImplementingAgencyEntity[] {
        return models.map((model) => this.toEntity(model));
    }
}
