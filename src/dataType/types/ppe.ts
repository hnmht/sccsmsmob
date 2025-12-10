import { Person } from "./person";
// Personal Protective Equipment
export interface PPE {
    id: number;
    code: string;
    name: string;
    model: string;
    unit: string;
    status: number;
    description: string;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}
// Personal Protective Equipment Front-end cache
export interface PPECache {
    queryTs: string;
    resultNumber: number;
    delItems: PPE[];
    updateItems: PPE[];
    newItems: PPE[];
    resultTs: string;
}