import { Person } from "./person";
// Voucher File
export interface VoucherFile {
    id: number;
    billBID: number;
    billHID: number;
    file: File;
    createDate: string;
    creator: Person;
    modifyDate: string;
    modifier: Person;
    ts: string;
    dr: number;
}

// Seacloud Data Type
export interface ScDataType {
    id: number;
    code: string;
    name: string;
    dataType: string;
    frontDb: string;
    inputMode: string;
}

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
