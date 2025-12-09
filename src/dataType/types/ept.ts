import { Person } from "./person";
import { ExecutionProject } from "./epa";
import { RiskLevel } from "./riskLevel";

// Execution Project Template Row
export interface EPTRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    epa: ExecutionProject; // EP
    allowDelRow: number;
    description: string;
    defaultValue: string;
    defaultValueDisp: string;
    isCheckError: number;
    errorValue: string;
    errorValueDisp: string;
    isRequireFile: number;
    isOnSitePhoto: number;
    riskLevel: RiskLevel;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}
// Execution Project Template Header
export interface EPT {
    id: number; // HID
    code: string;
    name: string;
    description: string;
    status: number;
    allowAddRow: number;
    allowDelRow: number;
    body: EPTRow[];
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}

// Execution Project Template Front-end Cache
export interface EPTCache {
    queryTs: string;
    resultNumber: number;
    delItems: EPT[];
    updateItems: EPT[];
    newItems: EPT[];
    resultTs: string;
}