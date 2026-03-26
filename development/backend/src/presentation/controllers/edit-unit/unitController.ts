import { UpdateUnitUseCase } from "../../../domain/use-cases/edit-unit/updateUnitUseCase.js";
import { TYPES } from "../../../di/editUnitTypes.js";
import { inject, injectable } from "inversify";

@injectable()
export class UnitController {
  constructor(
    @inject(TYPES.UpdateUnitUseCase) private updateUnitUseCase: UpdateUnitUseCase
  ) {}

  async update(req: any, res: any) {
    try {
      const unitId = Number(req.params.unit_id);
      const payload = {
        ...req.body,
        updated_by: req.user?.id || req.user?.userId
      };
      const result = await this.updateUnitUseCase.execute(unitId, payload);
      return res.status(200).json(result);

    } catch (error: any) {
      const message = error.message;

      if (message === "Unit not found") {
        return res.status(404).json({ status: 404, message, data: {} });
      }

      if (message === "Unit name already exists") {
        return res.status(409).json({ status: 409, message, data: {} });
      }

      if (message === "Missing required fields") {
        return res.status(400).json({ status: 400, message, data: {} });
      }

      return res.status(500).json({ status: 500, message: "Internal error", data: {} });
    }
  }
}
