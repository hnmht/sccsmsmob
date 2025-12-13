import { reqGetSimpDCList, reqGetSimpDCCache } from "../../api/dc";
import { SimpDC, SimpDCCache } from "../../dataType/types/dc";
import { LocalRepository } from "./respository";

// Simple Document Category
export const simpDCRepo = new LocalRepository<SimpDC, SimpDCCache>({
    table: "dc",
    recentTable: "dc_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "name": "name",
        "ts": "ts",
        "status":"status",
    },
    getFullData: reqGetSimpDCList,
    getCacheData: reqGetSimpDCCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});


