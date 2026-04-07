export interface IUnitRepository {
  findById(unitId: number): Promise<any>;
  findByName(name: string): Promise<any>;
  update(unitId: number, payload: any): Promise<any>;
}