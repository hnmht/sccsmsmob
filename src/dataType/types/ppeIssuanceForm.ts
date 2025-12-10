import { SimpDept } from "./department";
import { VoucherFile } from "./public";
import { Person } from "./person";
import { PPE } from "./ppe";

// Personal Protective Equipment Issuance Form Row
export interface PPEIssuanceFormRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    recipient: Person;
    positionName: string;
    deptName: string;
    ppeCode: string;
    ppe: PPE;
    ppeModel: string;
    ppeUnit: string;
    quantity: number;
    description: string;
    status: number; // 0 Free 1 Confirmed 2 Executing 3 Completed 4 none
    files: VoucherFile[]; // BFiles
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}

// Personal Protective Equipment Issuance Form Header
export interface PPEIssuanceForm {
    id: number; // HID
    billNumber: string;
    billDate: string;
    department: SimpDept;
    description: string;
    period: string;
    startDate: string;
    endDate: string;
    hFiles: VoucherFile[];
    body: PPEIssuanceFormRow[];
    sourceType: string; // DA: Direct Add WG: Wizard Generation
    status: number; // 0 Free 1 Confirmed 2 Executing 3 Completed
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}
// PPE Issuance Form Wizard Params
export interface PPEIssuanceFormWizardParams {
    billDate: string;
    department: SimpDept;
    description: string;
    period: string;
    startDate: string;
    endDate: string;
    creator: Person;
    generationType: number; // 0: Combined Generation 1: Separate Generation
}
// PPE Issuance Form Wizard
export interface PPEIssuanceFormWizard {
    params: PPEIssuanceFormWizardParams;
    recipients: Person[];
    vouchernumbers: string[];
}
// PPE Issuance Form Report
export interface PPEIssuanceFormReport {
    hid: number;
    bid: number;
    rowNumber: number;
    recipientID: number;
    recipientCode: string;
    recipientName: string;
    recipientPoisitionName: string;
    recipientDeptName: string;
    ppeID: number;
    ppeCode: string;
    ppeName: string;
    ppeModel: string;
    ppeUnit: string;
    quantity: number;
    bDescription: string;
    bStatus: number;
    billNumber: string;
    billDate: string;
    issuingDeptID: number;
    issuingDeptCode: string;
    issuingDeptName: string;
    hDescription: string;
    period: string;
    startDate: string;
    endDate: string;
    sourceType: string;
    hStatus: number;
    creatorID: number;
    creatorCode: string;
    creatorName: string;
}