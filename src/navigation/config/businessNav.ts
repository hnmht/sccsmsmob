import { WorkOrder } from "../../dataType/types/workOrder";

export interface WorkOrderParams {
    isLocal: boolean;
    isNew: boolean,
    isModify: boolean,
    oriWO: WorkOrder | undefined;
    onGoBack:(shouldRefresh:boolean) => void;
}