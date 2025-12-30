import { Person } from "./person";
import { File } from "./file";
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
    dr: 0 | 1;
}