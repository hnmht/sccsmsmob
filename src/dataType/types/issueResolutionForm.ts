import { ConstructionSite } from "./csa";
import { ExecutionProject } from "./epa";
import { Person } from "./person";
import { SimpDept } from "./department";
import { RiskLevel } from "./riskLevel";
import { VoucherFile } from "./public";

// Issue Resolution Form 
export interface IssueResolutionForm {
    id: number;
    billNumber: string;
    billDate: string;
    csa: ConstructionSite;
    epa: ExecutionProject;
    executionValue: string;
    executionValueDisp: string;
    executor: Person;
    department: SimpDept;
    issueOwner: Person;
    isFinish: number;
    handler: Person;
    startTime: string;
    endTime: string;
    eoDescription: string;
    description: string;
    status: number;
    sourceType: string;
    sourceBillNumber: string;
    sourceHID: number;
    sourceRowNumber: number;
    sourceBID: number;
    riskLevel: RiskLevel;
    sourceRowTs: string;
    issueFiles: VoucherFile[];
    fixFiles: VoucherFile[];
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}