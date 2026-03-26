import { injectable, inject } from "inversify";
import { TYPES } from "../../../di/editUnitTypes";
import { IUnitRepository } from "../../repositories/edit-unit/iUnitRepository";
import { IUnitMemberRepository } from "../../repositories/edit-unit/iUnitMemberRepository";
import { sendUserListRequest } from "../../../kafka/producers/userRequestProducer.js";

@injectable()
export class UpdateUnitUseCase {
  constructor(
    @inject(TYPES.UnitRepository) private unitRepository: IUnitRepository,
    @inject(TYPES.UnitMemberRepository) private unitMemberRepository: IUnitMemberRepository
  ) {}

  async execute(unitId: number, input: any) {
    // 1. 400 Validation
    if (!input.name || !input.org_unit_id || !input.members || !Array.isArray(input.members) || !input.receiving_officer_id || input.members.length === 0) {
        throw new Error("Missing required fields");
    }

    // 2. 404 Validation
    const unit = await this.unitRepository.findById(unitId);
    if (!unit) {
        throw new Error("Unit not found");
    }

    // 3. 409 Validation (Duplicate Name)
    const existingUnitWithName = await this.unitRepository.findByName(input.name);
    if (existingUnitWithName ) {
        throw new Error("Unit name already exists");
    }

    const { members, updated_by, ...unitData } = input;

    // Database Operations
    const updated = await this.unitRepository.update(unitId, { ...unitData, updated_by });
    await this.unitMemberRepository.deleteByUnitId(unitId, updated_by);
    
    const memberIds = members.map((m: any) => m.user_id);
    await this.unitMemberRepository.saveMembers(unitId, memberIds, updated_by);

    // Kafka Request
    const detailedMembers = await sendUserListRequest(memberIds);

    return {
      status: 200,
      message: "Unit updated successfully",
      data: {
        unit_id: updated.unit_id,
        name: updated.name,
        org_unit_id: updated.org_unit_id,
        receiving_officer_id: updated.receiving_officer_id,
        members: {
          count: detailedMembers.length,
          list: detailedMembers
        },
        updated_at: updated.updated_at,
        updated_by: updated.updated_by
      }
    };
  }
}