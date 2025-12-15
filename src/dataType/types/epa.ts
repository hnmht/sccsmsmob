import { SimpEPC } from "./epc";
import { RiskLevel } from "./riskLevel";
import { Person } from "./person";
import { UserDefineCategory } from "./udc";
import { ScDataType } from "./public";

// Execution Project
export interface ExecutionProject {
    id: number;
    code: string;
    name: string;
    epc: SimpEPC;
    description: string;
    status: number;
    resultType: ScDataType;
    udc: UserDefineCategory;
    defaultValue: any;
    defaultValueDisp: string;
    isCheckError: number;
    errorValue: any;
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

// Execution Project Front-end Cache
export interface EPCache {
    queryTs: string;
    resultNumber: number;
    delItems: ExecutionProject[];
    updateItems: ExecutionProject[];
    newItems: ExecutionProject[];
    resultTs: string;
}