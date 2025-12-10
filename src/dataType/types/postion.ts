import { Person } from "./person";

// Positon
export interface Position {
    id: number;
    name: string;
    description: string;
    status: number;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    dr: number;
    ts: string;
}
// Position Front-end Cache
export interface PositionCache {
    queryTs: string;
    resultNumber: number;
    delItems: Position[];
    updateItems: Position[];
    newItems: Position[];
    resultTs: string;
}