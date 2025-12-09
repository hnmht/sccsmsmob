import { Person } from "./person";

// Simple Construction Site Category
export interface SimpCSC {
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
// Construction Site Category
export interface CSC {
    id: number;
    name: string;
    description: string;
    fatherID: SimpCSC;
    status: number;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}

// Simple Construction Site Category Front-end cache
export interface SimpCSCCache {
    queryTs: string;
    resultNumber: number;
    delItems: SimpCSC[];
    updateItems: SimpCSC[];
    newItems: SimpCSC[];
    resultTs: string;
}