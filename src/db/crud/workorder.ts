import { WorkOrder } from "../../dataType/types/workOrder";
import { VoucherRepository } from "./voucherRespository";

export const workOrderRepo = new VoucherRepository<WorkOrder>({
    table: "workorder",
    primaryKey: "id",
});
