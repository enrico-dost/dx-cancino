import "reflect-metadata";
import { EditUnitTypeController } from "./presentation/controllers/unit-type/editUnitTypeController";
import { EditUnitTypeUseCase } from "./domain/use-cases/unit-type/editUnitTypeUseCase";
import { UnitTypeMapper } from "./data/mappers/unit-type/unitTypeMapper";
import { UnitTypeEntity } from "./domain/entities/unit-type/unitTypeEntity";
import { UnitTypeModel } from "./data/models/unit-type/unitTypeModel";

describe("Edit Unit Type API Component Tests", () => {
    
    // --- Mapper Tests ---
    describe("UnitTypeMapper", () => {
        it("should correctly map UnitTypeModel to UnitTypeEntity including updated_at", () => {
            const mockModel: UnitTypeModel = {
                unit_type_id: 2,
                unit_type_name: "Regional Office",
                unit_type_descr: "Description",
                is_active: true,
                updated_at: "2026-02-05T10:42:18Z"
            };

            const result = UnitTypeMapper.toEntity(mockModel);
            expect(result.updated_at).toBe("2026-02-05T10:42:18Z");
            expect(result.unit_type_id).toBe(2);
        });
    });

    // --- Use Case Tests ---
    describe("EditUnitTypeUseCase", () => {
        it("should call repository update with correct parameters", async () => {
            const mockRepo = {
                update: jest.fn().mockResolvedValue({ unit_type_id: 2 }),
                getAllUnitTypes: jest.fn()
            };
            const useCase = new EditUnitTypeUseCase(mockRepo as any);
            await useCase.execute(2, { unit_type_name: "New Name" });
            
            expect(mockRepo.update).toHaveBeenCalledWith(2, { unit_type_name: "New Name" });
        });
    });

    // --- Controller Tests ---
    describe("EditUnitTypeController", () => {
        let controller: EditUnitTypeController;
        let mockUseCase: any;
        let mockRes: any;

        beforeEach(() => {
            mockUseCase = { execute: jest.fn() };
            controller = new EditUnitTypeController(mockUseCase);
            mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
        });

        it("should return 400 if is_active is not a boolean", async () => {
            const mockReq = { 
                params: { unit_type_id: "2" }, 
                body: { is_active: "not-a-boolean" } 
            } as any;

            await controller.editUnitType(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
        });

        it("should return 404 if the unit type does not exist", async () => {
            mockUseCase.execute.mockResolvedValue(null);
            const mockReq = { 
                params: { unit_type_id: "999" }, 
                body: { unit_type_name: "Ghost Office" } 
            } as any;

            await controller.editUnitType(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });

        it("should return 200 on successful update", async () => {
            const updatedData = { unit_type_id: 2, unit_type_name: "Updated Name" };
            mockUseCase.execute.mockResolvedValue(updatedData);
            const mockReq = { 
                params: { unit_type_id: "2" }, 
                body: { unit_type_name: "Updated Name" } 
            } as any;

            await controller.editUnitType(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Unit type updated successfully."
            }));
        });
    });
});