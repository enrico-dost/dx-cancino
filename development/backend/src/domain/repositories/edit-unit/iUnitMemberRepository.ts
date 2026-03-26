export interface IUnitMemberRepository {
  deleteByUnitId(unitId: number, updatedBy: number): Promise<void>;
  saveMembers(unitId: number, userIds: number[], createdBy: number): Promise<void>;
  findByUnitId(unitId: number): Promise<any[]>;
}