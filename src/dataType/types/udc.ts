import { Person } from "./person";
// User Define Category
export interface UserDefineCategory {
    id: number;
    name: string;
    description: string;
    isLevel: number;
    status: number;
    createDate: string;
    creator: Person;
    modifier: Person;
    modifyDate: string;
    ts: string;
    dr: number;
}
// User Define Category Front-end Cache
export interface UDCCache {
    queryTs: string;
    resultNumber: number;
    delItems: UserDefineCategory[];
    updateItems: UserDefineCategory[];
    newItems: UserDefineCategory[];
    resultTs: string;
}