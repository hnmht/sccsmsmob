import { Person } from "./person";
// Risk Level
export interface RiskLevel {
    id: number;
    name: string;
    description: string;
    color: string;
    status: number;
    createDate: string;
    creator: Person;
    modifier: Person;
    modifyDate: string;
    ts: string;
    dr: number;
}
// Risk Level front-end cache
export interface RLCache {
    queryTs: string;
    resultNumber: number;
    delItems: RiskLevel[];
    updateItems: RiskLevel[];
    newItems: RiskLevel[];
    resultTs: string;
}