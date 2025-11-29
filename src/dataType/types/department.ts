import { Person } from "./person";

export interface SimpDept {
    id: number;
    code?: string;
    name?: string;
    fatherID?: number;
    leader?: Person;
    description?: string;
    status?: number;
    createDate?: string;
    ts?: string;
    dr?: number;
}

export interface Department {
    id: number;
    code?: string;
    name?: string;
    fatherID?: SimpDept;
    leader?: Person;
    description?: string;
    status?: number;
    createDate?: string;
    creator?: Person;
    modifier?: Person;
    modifyDate?: string;
    ts?: string;
    dr?: number;
}