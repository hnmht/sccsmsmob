import { Person } from "./person";

// Simple Execution Project Category
export interface SimpEPC {
    id: number;
    name: string;
    description: string;
    fatherID: number;
    status: number;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}

// Execution Project Category
export interface EPC {
    id: number;
    name: string;
    description: string;
    fatherID: SimpEPC;
    status: number;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}
// Execution Project Category Front-end Cache
export interface SimpEPCCache {
    queryTs: string;
    resultNumber: number;
    delItems: SimpEPC[];
    updateItems: SimpEPC[];
    newItems: SimpEPC[];
    resultTs: string;
}