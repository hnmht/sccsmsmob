import { ExecutionOrder } from "../../dataType/types/executionOrder";
import { WorkOrder, WorkOrderRow } from "../../dataType/types/workOrder";

export interface WorkOrderParams {
    isLocal: boolean;
    isNew: boolean,
    isModify: boolean,
    oriWO: WorkOrder | undefined;
    onGoBack:(shouldRefresh:boolean) => void;
}

export interface ExecutionOrderParams {
    isLocal: boolean;
    isNew: boolean,
    isModify: boolean,
    oriWOR:WorkOrderRow | undefined;
    oriEO: ExecutionOrder | undefined;
    onGoBack: (shouldRefresh: boolean) => void;
}