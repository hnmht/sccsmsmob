import { WorkOrder } from "../../dataType/types/workOrder";

export interface WorkOrderParams {
    isNew: boolean,
    isModify: boolean,
    oriWO: WorkOrder | undefined;
}