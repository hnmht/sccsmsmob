import { UserDefineCategory } from "./udc";
import { UserDefinedArchive } from "./uda";
import { Person } from "./person";
// Construction Site Options
export interface ConstructionSiteOption {
    id: number;
    code: string;
    name: string;
    displayName: string;
    udc: UserDefineCategory;
    defaultValue: UserDefinedArchive;
    enable: number;
    isModify: number;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}
// Construction Site Option Front-end Cache
export interface ConstructionSiteOptionCache {
    queryTs: string;
    resultNumber: number;
    delItems: ConstructionSiteOption[];
    updateItems: ConstructionSiteOption[];
    newItems: ConstructionSiteOption[];
    resultTs: string;
}