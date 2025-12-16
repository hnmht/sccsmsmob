import { Person } from "./person";

// export type ScTypeAllowInput = "department" | "epa" | "epc" |"ept"| "person" | "csa"| "csc" | "cso" | "udc" | "risklevel" | "dc" | "position" | "tc" | "ppe" | "udc";

// Data query Params
export interface QueryParams {
    queryString: string;
}

// Data query pagination
export interface PagingQueryParams {
    queryString: string;
    page: number;
    perPage: number;
}

// Front Database information
export interface FrontDBInfo {
    id: number;
    dbID: string;
    frontDbID: string;
    cryptoKey: string;
    createDate: string;
    creator: Person;
    dr: number;
    ts: string;
}
