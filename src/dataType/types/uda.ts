import { UserDefineCategory } from "./udc";
import { Person } from "./person";
// User Define Category
export interface UserDefinedArchive {
    id: number;
    udc: UserDefineCategory;
    code: string;
    name: string;
    description: string;
    fatherID: number;
    status: number;
    createDate: string;
    creator: Person;
    modifier: Person;
    modifyDate: string;
    ts: string;
    dr: number;
}
// User Define Category Front-end Cache
export interface UDACache {
    queryTs: string;
    resultNumber: number;
    delItems: UserDefinedArchive[];
    updateItems: UserDefinedArchive[];
    newItems: UserDefinedArchive[];
    resultTs: string;
}