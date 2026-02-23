import { dayjs, EpochTime } from "../../i18n/dayjs";
import { WorkOrderRow } from "../types/workOrder";
import { getEmptyCSA } from "./csa";
import {  getEmptySimpDept } from "./department";
import { getEmptyEPT } from "./ept";
import { getEmptyPerson } from "./person";

// Generate empty Work Order Row
export function getDefaultWorkOrderRow(): WorkOrderRow {
    return {
        id: 0,
        hid: 0,
        rowNumber: 10,
        csa: getEmptyCSA(),
        executor: getEmptyPerson(),
        description: "",
        ept: getEmptyEPT(),
        startTime: dayjs(new Date()).startOf("day").add(9, "hour").toISOString(),
        endTime: dayjs(new Date()).startOf("day").add(17, "hour").toISOString(),
        status: 0,
        eoID: 0,
        eoNumber: "",
        createDate: dayjs(new Date()).toISOString(),
        creator: getEmptyPerson(),
        confirmDate: EpochTime,
        confirmer: getEmptyPerson(),
        modifyDate: EpochTime,
        modifier: getEmptyPerson(),
        ts: dayjs(new Date()).toISOString(),
        dr: 0,
        billNumber: "",
        billDate: dayjs(new Date()).toISOString(),
        department: getEmptySimpDept(),
        headerDescription: "",
        workDate: dayjs(new Date()).toISOString(),
    }
}