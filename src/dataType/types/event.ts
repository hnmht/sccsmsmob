import { ConstructionSite } from "./csa";
import { EPT } from "./ept";
import { VoucherFile } from "./voucherFile";
import { Person } from "./person";

// User Event
export interface Event {
    id: number;
    csa: ConstructionSite;
    ept: EPT;
    start: string;
    end: string;
    status: 0 | 1;
    editable: boolean;
    allDay: boolean;
    backgroundColor: string;
    billType: string;
    hid: number;
    billNumber: string;
    rowNumber: number;
    hDescription: string;
    bDescription: string;
    epaName: string;
    epaValueDisp: string;
    files: VoucherFile[];
    creator: Person;
}
// user Event Params
export interface UserEvents {
    userID: number;
    start: string;
    end: string;
    resultNumber: number;
    events: Event[];
}