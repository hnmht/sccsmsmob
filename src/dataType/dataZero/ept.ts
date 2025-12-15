import { EpochTime } from "../../i18n/dayjs";
import { EPT, EPTRow } from "../types/ept";
import { getEmptyEP } from "./epa";
import { getEmptyPerson } from "./person";
import { getEmptyRiskLevel } from "./riskLevel";

export function getEmptyEPTRow(): EPTRow {
    const eptRow: EPTRow = {
        id: 0, // BID
        hid: 0,
        rowNumber: 0,
        epa: getEmptyEP(), // EP
        allowDelRow: 0,
        description: "",
        defaultValue: "0",
        defaultValueDisp: "",
        isCheckError: 0,
        errorValue: "0",
        errorValueDisp: "",
        isRequireFile: 0,
        isOnSitePhoto: 0,
        riskLevel: getEmptyRiskLevel(),
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: EpochTime,
        dr: 0,
    }
    return eptRow
}

export function getEmptyEPT(): EPT {
    const ept: EPT = {
        id: 0, // HID
        code: "",
        name: "",
        description: "",
        status: 0,
        allowAddRow: 1,
        allowDelRow: 1,
        body: [getEmptyEPTRow()],
        createDate: EpochTime,
        creator: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: EpochTime,
        dr: 0,
    };
    return ept
}