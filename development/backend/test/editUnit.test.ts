import { UpdateUnitUseCase } from '../src/domain/use-cases/edit-unit/updateUnitUseCase.js';
import { IUnitRepository } from '../src/domain/repositories/edit-unit/iUnitRepository';
import { IUnitMemberRepository } from '../src/domain/repositories/edit-unit/iUnitMemberRepository.js';
import { jest, describe, expect, beforeEach, it } from '@jest/globals';

jest.mock("../src/kafka/producers/userRequestProducer.js", () => ({
   
    sendUserListRequest: jest.fn().mockImplementation(() => 
        Promise.resolve([
            { user_id: 1, first_name: "John", last_name: "Doe", avatar: null },
            { user_id: 124, first_name: "Jane", last_name: "Smith", avatar: null }
        ] as any)
    )
}));

describe('UpdateUnitUseCase', () => {
    let updateUnitUseCase: UpdateUnitUseCase;
    let mockUnitRepository: jest.Mocked<IUnitRepository>;
    let mockUnitMemberRepository: jest.Mocked<IUnitMemberRepository>;

    beforeEach(() => {
        mockUnitRepository = {
            findById: jest.fn(),
            findByName: jest.fn(),
            update: jest.fn()
        };

        mockUnitMemberRepository = {
            deleteByUnitId: jest.fn(),
            saveMembers: jest.fn(),
            findByUnitId: jest.fn()
        };

        updateUnitUseCase = new UpdateUnitUseCase(
            mockUnitRepository,
            mockUnitMemberRepository
        );
    });

    describe('execute', () => {
       
        const unitId = 501; 
        const updateInput = {
            name: 'IT Unit',
            org_unit_id: 1,
            receiving_officer_id: 1,
            members: [
                { user_id: 1 },
                { user_id: 124 }
            ],
            updated_by: 100
        };

    it('should successfully update a unit and its organization link', async () => {
        const mockDetailedMembers = [
            { user_id: 1, first_name: "John", last_name: "Doe", avatar: null },
            { user_id: 124, first_name: "Jane", last_name: "Smith", avatar: null }
        ];

        const expectedData = {
            unit_id: 501,
            name: 'IT Unit',
            org_unit_id: 1,
            receiving_officer_id: 1, 
            members: {
                count: 2,
                list: mockDetailedMembers
            },
            updated_at: "2026-02-09T13:42:00Z",
            updated_by: 100
            };

            // 3. Mock Repositories
        mockUnitRepository.findById.mockResolvedValue({ unit_id: unitId, is_active: true } as any);
        mockUnitRepository.findByName.mockResolvedValue(null);
            
        mockUnitRepository.update.mockResolvedValue({
            unit_id: 501,
            name: 'IT Unit',
            org_unit_id: 1,
            receiving_officer_id: 1,
            updated_at: "2026-02-09T13:42:00Z",
            updated_by: 100
        } as any);

        const result = await updateUnitUseCase.execute(unitId, updateInput);

        expect(result).toEqual({
            status: 200,
            message: "Unit updated successfully",
            data: expectedData
        });
    }, 15000);

    it('should return 404 for unit not found', async () => {
        mockUnitRepository.findById.mockResolvedValue(null);

        await expect(updateUnitUseCase.execute(unitId, updateInput))
            .rejects
            .toThrow('Unit not found');
     });

     it('should return 409 for duplicate unit name', async () => {
        mockUnitRepository.findById.mockResolvedValue({ unit_id: unitId });
        mockUnitRepository.findByName.mockResolvedValue({ unit_id: 999, name: 'IT Unit' });

        await expect(updateUnitUseCase.execute(unitId, updateInput))
            .rejects
            .toThrow('Unit name already exists');
    });

    it('should return 400 for an empty members array', async () => {
        const invalidInput = { ...updateInput, members: [] };

         await expect(updateUnitUseCase.execute(unitId, invalidInput))
            .rejects
            .toThrow('Missing required fields');
        });
    });
});