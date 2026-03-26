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
      };

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
    });

    it("should throw error when org unit does not exist", async () => {
      mockRepository.existsOrgUnit.mockResolvedValue(false);

      await expect(
        useCase.execute({
          user_id: 1,
          org_unit_id: 999,
          perm_id: 3,
          is_active: true,
        })
      ).rejects.toThrow("User not found or invalid org_unit_id provided.");
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

  describe("GetUserOrgUnitAccessByUserUseCase", () => {
    let useCase: GetUserOrgUnitAccessByUserUseCase;

    beforeEach(() => {
      useCase = new GetUserOrgUnitAccessByUserUseCase(mockRepository);
    });

    it("should return user access records", async () => {
      const fakeData: UserOrgUnitAccessEntity[] = [
        {
          user_id: 1,
          org_unit_id: 2,
          perm_id: 3,
          is_active: true,
        },
      ];

      mockRepository.getByUserId.mockResolvedValue(fakeData);

      const result = await useCase.execute(1);

      expect(result).toEqual(fakeData);
    });

    it("should return empty array", async () => {
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