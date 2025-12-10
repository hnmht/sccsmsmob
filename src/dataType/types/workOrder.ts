import { SimpDept } from "./department";
import { Person } from "./person";
import { ConstructionSite } from "./csa";
import { EPT } from "./ept";
// Work Order Row
export interface WorkOrderRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    csa: ConstructionSite;
    executor: Person;
    description: string;
    ept: EPT;
    startTime: string;
    endTime: string;
    status: number;
    eoID: number;
    eoNumber: string;
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
    // Header fields duplicated in row for convenience:
    billNumber: string;
    billDate: string;
    department: SimpDept;
    headerDescription: string; // HDescription
    workDate: string;
}

// Work Order Header
export interface WorkOrder {
    id: number; // HID
    billNumber: string;
    billDate: string;
    department: SimpDept;
    description: string;
    status: number;
    workDate: string;
    body: WorkOrderRow[];
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}