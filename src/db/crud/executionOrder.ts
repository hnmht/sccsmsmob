import { ExecutionOrder } from "../../dataType/types/executionOrder";
import { VoucherRepository } from "./voucherRespository";

export const executionOrderRepo = new VoucherRepository<ExecutionOrder>({
    table: "executionorder",
    primaryKey: "id",
});
