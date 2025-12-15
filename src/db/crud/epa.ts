import { reqGetEPList, reqGetEPCache } from "../../api/epa";
import { queryDataTs, updateDataTs, addDataTs, executeSQL, getDocByID } from "../db";
import { EPCache, ExecutionProject } from "../../dataType/types/epa";
import { MasterDataRepository } from "./respository";

//执行项目档案后端批量转前端
const transEPsToFrontend = (eps: ExecutionProject[]): ExecutionProject[] => {
    for (let newEP of eps) {
        switch (newEP.resultType.id) {
            case 301:
            case 306:
            case 307:
                break;
            case 302:
                newEP.defaultValue = parseFloat(newEP.defaultValue);
                newEP.errorValue = parseFloat(newEP.errorValue);
                break;
            case 401:
            case 404:
                newEP.defaultValue = parseInt(newEP.defaultValue);
                newEP.errorValue = parseInt(newEP.errorValue);
                break;
            case 510:
            case 520:
            case 525:
            case 530:
            case 540:
            case 550:
                newEP.defaultValue = newEP.defaultValue !== "0" ? getDocByID(newEP.resultType.frontDb, parseInt(newEP.defaultValue)) : GetDataTypeDefaultValue(newEP.resultType.id);
                newEP.errorValue = newEP.errorValue !== "0" ? getDocByID(newEP.resultType.frontDb, parseInt(newEP.errorValue)) : GetDataTypeDefaultValue(newEP.resultType.id);
                break;
            default:
                console.error("No matching DataType");
        }
    }
    return eps;
};

// Execution Project Archive
export const EPARepo = new MasterDataRepository<ExecutionProject, EPCache>({
    table: "epa",
    recentTable: "epa_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "epcid": "epc.id",
        "status": "status",
        "ts": "ts",
    },
    convertToFront: transEPsToFrontend,
    getFullData: reqGetEPList,
    getCacheData: reqGetEPCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});


