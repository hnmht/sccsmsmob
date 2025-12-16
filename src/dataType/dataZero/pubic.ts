import { getEmptyCSA } from "./csa";
import { getEmptyCSC } from "./csc";
import { getEmptyCSO } from "./cso";
import { getEmptySimpDC } from "./dc";
import { getEmptyDepartment } from "./department";
import { getEmptyEP } from "./epa";
import { getEmptySimpEPC } from "./epc";
import { getEmptyEPT } from "./ept";
import { getEmptyPerson } from "./person";
import { getEmptyPosition } from "./position";
import { getEmptyPPE } from "./ppe";
import { getEmptyRiskLevel } from "./riskLevel";
import { getEmptyTC } from "./tc";
import { getEmptyUDC } from "./udc";

export function getEmptyQueryParams<T>(ts: string): T {
    const emptyParam = {
        queryTs: ts,
        resultNumber: 0,
        delItems: [],
        updateItems: [],
        newItems: [],
        resultTs: ts
    } as T;
    return emptyParam;
}
// export type ScTypeAllowInput = "department" | "epa" | "epc" |"ept"| "person" | "csa"| "csc" | "cso" | "udc" 
// | "risklevel" | "dc" | "position" | "tc" | "ppe" | "udc";
export function getEmptyByType(dataType: string): any {
    switch (dataType) {
        case "department":
            return getEmptyDepartment();
        case "epa":
            return getEmptyEP();
        case "epc":
            return getEmptySimpEPC();
        case "ept":
            return getEmptyEPT();
        case "person":
            return getEmptyPerson();
        case "csa":
            return getEmptyCSA();
        case "csc":
            return getEmptyCSC();
        case "cso":
            return getEmptyCSO();
        case "udc":
            return getEmptyUDC();
        case "risklevel":
            return getEmptyRiskLevel();
        case "dc":
            return getEmptySimpDC();
        case "position":
            return getEmptyPosition();
        case "tc":
            return getEmptyTC();
        case "ppe":
            return getEmptyPPE();
        case "udc":
            return getEmptyUDC();
        default:
            throw new Error("Failed ScDataType");
    }
}