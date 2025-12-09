import { SimpDept } from "./department";
import { ConstructionSite } from "./csa";
import { Person } from "./person";
import { EPT } from "./ept";
import { ExecutionProject } from "./epa";
import { VoucherFile } from "./public";
import { RiskLevel } from "./riskLevel";
// Execution Order Row
export interface ExecutionOrderRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    epa: ExecutionProject;
    allowDelRow: number;
    executionValue: string;
    executionValueDisp: string;
    files: VoucherFile[];
    description: string;
    epaDescription: string;
    isCheckError: number;
    errorValue: string;
    errorValueDisp: string;
    isRequireFile: number;
    isOnSitePhoto: number;
    isIssue: number;
    isRectify: number;
    isHandle: number;
    issueOwner: Person;
    handleStartTime: string;
    handleEndTime: string;
    status: number;
    isFromEpt: number;
    isFinish: number;
    irfID: number;
    irfNumber: string;
    riskLevel: RiskLevel;
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}

// Execution Order Header
export interface ExecutionOrder {
    id: number; // HID
    billNumber: string;
    billDate: string;
    department: SimpDept;
    description: string;
    status: number; // 0: free, 1: confirmed, 2: executing, 3: completed
    sourceType: string;
    sourceBillNumber: string;
    sourceHID: number;
    sourceRowNumber: number;
    sourceBID: number;
    sourceRowTs: string;
    startTime: string;
    endTime: string;
    csa: ConstructionSite;
    executor: Person;
    ept: EPT;
    allowAddRow: number;
    allowDelRow: number;
    body: ExecutionOrderRow[];
    issueNumber: number;
    reviewedNumber: number;
    reviewedSeconds: number;
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}

// Execution Order Record for Reference by Downstreams Voucher
export interface ReferExecutionOrder {
    id: number; // BID
    hid: number;
    rowNumber: number;
    epa: ExecutionProject;
    executionValue: string;
    executionValueDisp: string;
    description: string;
    eoFiles: VoucherFile[];
    isHandle: number;
    issueOwner: Person;
    handleStartTime: string;
    handleEndTime: string;
    status: number;
    riskLevel: RiskLevel;
    dr: number;
    ts: string;
    isFinish: number;
    billNumber: string;
    billDate: string;
    department: SimpDept;
    csa: ConstructionSite;
    executor: Person;
}
// Execution Order Comment Record 
export interface ExecutionOrderComment {
    id: number;
    hid: number;
    bid: number;
    rowNumber: number;
    billNumber: string;
    sendTo: Person;
    isRead: number;
    readTime: string;
    content: string;
    sendTime: string;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}
// Execution Order Review Record 
export interface ExecutionOrderReview {
    id: number;
    hid: number;
    billNumber: string;
    startTime: string;
    endTime: string;
    consumeSeconds: number;
    createDate: string;
    creator: Person;
    ts: string;
    dr: number;
}

// Execution Order Comments Params
export interface EOCommentsParams {
    hid: number;
    comments: ExecutionOrderComment[];
}
// Execution Order Reviews Params
export interface EOReviewsParams {
    hid: number;
    reviews: ExecutionOrderReview[];
}
// Execution Order List Params 
export interface EOListPaging {
    eos: ExecutionOrder[];
    count: number;
    page: number;
    perPage: number;
}