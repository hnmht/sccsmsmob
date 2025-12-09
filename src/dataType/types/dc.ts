import { Person } from "./person";

// Simple Document Category
export interface SimpDC {
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
// Document Category
export interface DC {
    id: number;
    name: string;
    description: string;
    fatherID: SimpDC;
    status: number;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}
// Simple Document Category Front-end Cache
export interface SimpDCCache {
    queryTs: string;
    resultNumber: number;
    delItems: SimpDC[];
    updateItems: SimpDC[];
    newItems: SimpDC[];
    resultTs: string;
}