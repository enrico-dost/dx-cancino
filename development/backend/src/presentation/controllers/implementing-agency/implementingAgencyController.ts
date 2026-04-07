import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import type { getImplementingAgenciesByUnitTypeUseCase } from '../../../domain/use-cases/implementing-agency/getImplementingAgenciesByUnitTypeUseCase';
import { TYPES } from '../../../di/types';
import type { ImplementingAgencyEntity } from '../../../domain/entities/implementing-agency/implementingAgencyEntity';

/**
 * Implementing Agency Controller
 * Handles HTTP requests for implementing agency operations
 */
@injectable()
export class implementingAgencyController {
    constructor(
        @inject(TYPES.getImplementingAgenciesByUnitTypeUseCase)
        private getImplementingAgenciesByUnitTypeUseCase: getImplementingAgenciesByUnitTypeUseCase
    ) { }

    /**
     * Get implementing agencies by unit type(s)
     * Supports query parameter: unit_types (comma-separated list or single value)
     * Defaults to unit_type=1 (Agency) if not provided
     * @param req Express Request
     * @param res Express Response
     */
    async getByUnitTypes(req: Request, res: Response): Promise<void> {
        try {
            // Parse unit_types query parameter
            // Expected format: ?unit_types=1 or ?unit_types=1,2
            let unitTypeIds: number[] = [];

            const unitTypeParam = req.query.unit_types as string | undefined;

            if (unitTypeParam) {
                // Validate format: must be comma-separated integers
                const values = unitTypeParam.split(',').map((val) => val.trim());
                
                // Check if all values are valid integers
                const allValid = values.every((val) => /^\d+$/.test(val));
                if (!allValid) {
                    res.status(400).json({
                        status: 400,
                        message: 'Invalid unit_types parameter. Must be comma-separated integers.',
                        data: {}
                    });
                    return;
                }

                // Convert to numbers
                unitTypeIds = values.map((val) => parseInt(val, 10));
            }

            // Execute use case (defaults to [1] if empty)
            const agencies: ImplementingAgencyEntity[] = await this.getImplementingAgenciesByUnitTypeUseCase.execute(
                unitTypeIds
            );

            if (agencies.length === 0) {
                res.status(200).json({
                    status: 200,
                    message: 'No implementing agencies found.',
                    data: {}
                });
                return;
            }

            res.status(200).json({
                status: 200,
                message: 'Successfully retrieved implementing agencies.',
                data: agencies
            });
        } catch (error) {
            console.error('Error in implementingAgencyController.getByUnitTypes:', error);
            res.status(500).json({
                status: 500,
                message: 'Internal server error',
                errors: {
                    detail: error instanceof Error ? error.message : 'Unknown error'
                }
            });
        }
    }
}
