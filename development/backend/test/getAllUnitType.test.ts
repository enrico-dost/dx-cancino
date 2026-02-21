import "reflect-metadata";

import { GetAllUnitTypesUseCase } from "../src/domain/use-cases/unit-type/getAllUnitTypesUseCase";
import type { UnitTypeRepository } from "../src/domain/repositories/unit-type/unitTypeRepository";
import type { UnitTypeEntity } from "../src/domain/entities/unit-type/unitTypeEntity";


describe("GetAllUnitTypesUseCase", () => {
  let mockRepository: jest.Mocked<UnitTypeRepository>;
  let useCase: GetAllUnitTypesUseCase;

  beforeEach(() => {
    mockRepository = {
      getAllUnitTypes: jest.fn(),
    };

    useCase = new GetAllUnitTypesUseCase(mockRepository);
  });

  it("should return unit types when repository has data", async () => {
    const fakeData: UnitTypeEntity[] = [
      {
        unit_type_id: 1,
        unit_type_name: "Agency",
        unit_type_descr: "Primary government body",
        is_active: true,
      },
    ];

    mockRepository.getAllUnitTypes.mockResolvedValue(fakeData);

    const result = await useCase.execute();

    expect(result).toEqual(fakeData);
    expect(mockRepository.getAllUnitTypes).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when repository has no data", async () => {
    mockRepository.getAllUnitTypes.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("should throw error when repository fails", async () => {
    mockRepository.getAllUnitTypes.mockRejectedValue(new Error("DB error"));

    await expect(useCase.execute()).rejects.toThrow("DB error");
  });
});
