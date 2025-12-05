import { File } from "./file";

export interface Person {
    id: number;
    code?: string;
    name?: string;
    avater?: File;
    deptID?: number;
    deptCode?: string;
    deptName?: string;
    isOperator?: number;
    positionID?: number;
    positionName?: string;
    description?: string;
    mobile?: string;
    email?: string;
    gender?: number;
    systemFlag?: number;
    status?: number;
    createDate?: string;
    ts?: string;
    dr?: number;
}