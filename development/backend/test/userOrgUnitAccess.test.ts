import "reflect-metadata";

import { UpsertUserOrgUnitAccessUseCase } from "../src/domain/use-cases/user-org-unit-access/upsertUserOrgUnitAccessUseCase";
import { GetUserOrgUnitAccessByUserUseCase } from "../src/domain/use-cases/user-org-unit-access/getUserOrgUnitAccessByUserUseCase";

import type { UserOrgUnitAccessRepository } from "../src/domain/repositories/user-org-unit-access/userOrgUnitAccessRepository";
import type { UserOrgUnitAccessEntity } from "../src/domain/entities/user-org-unit-access/userOrgUnitAccessEntity";

describe("UserOrgUnitAccessUseCases", () => {
  let mockRepository: jest.Mocked<UserOrgUnitAccessRepository>;

  beforeEach(() => {
    mockRepository = {
      upsertAccess: jest.fn(),
      getByUserId: jest.fn(),
      existsOrgUnit: jest.fn(),
    };
  });

  // ==========================
  // UpsertUserOrgUnitAccessUseCase
  // ==========================

  describe("UpsertUserOrgUnitAccessUseCase", () => {
    let useCase: UpsertUserOrgUnitAccessUseCase;

    beforeEach(() => {
      useCase = new UpsertUserOrgUnitAccessUseCase(mockRepository);
    });

    it("should return entity and created flag when repository succeeds", async () => {
      const fakeEntity: UserOrgUnitAccessEntity = {
        user_id: 1,
        org_unit_id: 2,
        perm_id: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Mock validation to PASS
      mockRepository.existsOrgUnit.mockResolvedValue(true);

      mockRepository.upsertAccess.mockResolvedValue({
        entity: fakeEntity,
        created: true,
      });

      const result = await useCase.execute({
        user_id: 1,
        org_unit_id: 2,
        perm_id: 3,
        is_active: true,
      });

      expect(result).toEqual({
        entity: fakeEntity,
        created: true,
      });

      expect(mockRepository.existsOrgUnit).toHaveBeenCalledWith(2);
      expect(mockRepository.upsertAccess).toHaveBeenCalledTimes(1);
    });

    it("should throw error when org unit does not exist", async () => {
      // Mock validation to FAIL
      mockRepository.existsOrgUnit.mockResolvedValue(false);

      await expect(
        useCase.execute({
          user_id: 1,
          org_unit_id: 999,
          perm_id: 3,
          is_active: true,
        })
      ).rejects.toThrow("Invalid org_unit_id");

      expect(mockRepository.upsertAccess).not.toHaveBeenCalled();
    });

    it("should throw error when repository fails", async () => {
      mockRepository.existsOrgUnit.mockResolvedValue(true);

      mockRepository.upsertAccess.mockRejectedValue(
        new Error("DB error")
      );

      await expect(
        useCase.execute({
          user_id: 1,
          org_unit_id: 2,
          perm_id: 3,
          is_active: true,
        })
      ).rejects.toThrow("DB error");
    });
  });

  // ==========================
  // GetUserOrgUnitAccessByUserUseCase
  // ==========================

  describe("GetUserOrgUnitAccessByUserUseCase", () => {
    let useCase: GetUserOrgUnitAccessByUserUseCase;

    beforeEach(() => {
      useCase = new GetUserOrgUnitAccessByUserUseCase(mockRepository);
    });

    it("should return user access records when repository has data", async () => {
      const fakeData: UserOrgUnitAccessEntity[] = [
        {
          user_id: 1,
          org_unit_id: 2,
          perm_id: 3,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockRepository.getByUserId.mockResolvedValue(fakeData);

      const result = await useCase.execute(1);

      expect(result).toEqual(fakeData);
      expect(mockRepository.getByUserId).toHaveBeenCalledWith(1);
      expect(mockRepository.getByUserId).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no records exist", async () => {
      mockRepository.getByUserId.mockResolvedValue([]);

      const result = await useCase.execute(1);

      expect(result).toEqual([]);
    });

    it("should throw error when repository fails", async () => {
      mockRepository.getByUserId.mockRejectedValue(
        new Error("DB error")
      );

      await expect(useCase.execute(1)).rejects.toThrow("DB error");
    });
  });
});