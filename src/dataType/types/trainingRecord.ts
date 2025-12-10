import { SimpDept } from "./department";
import { Person } from "./person";
import { TC } from "./tc";
import { VoucherFile } from "./public";

// Training Record Row
export interface TrainingRecordRow {
    id: number; // BID
    hid: number;
    rowNumber: number;
    student: Person;
    positionName: string;
    deptName: string;
    startTime: string;
    endTime: string;
    classHour: number;
    description: string;
    examRes: number;
    examScore: number;
    status: number;
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

// Training Record Header
export interface TrainingRecord {
    id: number; // HID
    billNumber: string;
    billDate: string;
    department: SimpDept;
    description: string;
    lecturer: Person;
    trainingDate: string;
    tc: TC;
    startTime: string;
    endTime: string;
    classHour: number;
    isExam: number;
    hFiles: VoucherFile[];
    body: TrainingRecordRow[];
    status: number; // 0 free 1 confirmed 2 executing 3 completed
    createDate: string;
    creator: Person;
    confirmDate: string;
    confirmer: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}
// Taught Lessons Report 
export interface TaughtLessonsReport {
    hid: number;
    billNumber: string;
    billDate: string;
    id: number; // Dept ID
    deptCode: string;
    deptName: string;
    description: string;
    lecturerID: number;
    lecturerCode: string;
    lecturerName: string;
    trainingDate: string;
    tcID: number;
    tcCode: string;
    tcName: string;
    startTime: string;
    endTime: string;
    classHour: number;
    isExam: number;
    studentNumber: number;
    qualifiedNumber: number;
    disqualificationNumber: number;
    status: number;
    creatorID: number;
    creatorCode: string;
    creatorName: string;
}
// Recireved Training Report
export interface RecivedTrainingReport {
    hid: number;
    bid: number;
    billNumber: string;
    billDate: string;
    id: number; // Dept ID
    deptCode: string;
    deptName: string;
    lecturerID: number;
    lecturerCode: string;
    lecturerName: string;
    tcID: number;
    tcCode: string;
    tcName: string;
    startTime: string;
    endTime: string;
    tcClassHour: number;
    isExam: number;
    hStatus: number;
    hDescription: string;
    studentID: number;
    studentCode: string;
    studentName: string;
    studentPositionName: string;
    studentDeptName: string;
    signStartTime: string;
    signEndTime: string;
    bClassHour: number;
    bDescription: string;
    examRes: number;
    examScore: number;
    bStatus: number;
    creatorID: number;
    creatorCode: string;
    creatorName: string;
}