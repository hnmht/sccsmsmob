import { reqGetCSOs, reqGetCSOCache } from "../../api/cso";
import { getEmptyQueryParams } from "../../dataType/dataZero/pubic";
import { ConstructionSiteOption, ConstructionSiteOptionCache } from "../../dataType/types/cso";
import { queryDataTs, updateDataTs, addDataTs, executeSQLWithParams } from "../db";

const dataName = "cso";

export async function initCSOCache() {
    // Get existing timestamp
    let ts = queryDataTs(dataName);
    if (ts === "") {
        const res = await reqGetCSOs(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            // Save latest timestamp
            addDataTs(dataName, latestTs);
            // Bulk add all CSOs
            bulkAddCSOs(res.data);
        }
    } else {
        const params = getEmptyQueryParams<ConstructionSiteOptionCache>(ts);
        const cacheRes = await reqGetCSOCache(params, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                // Existing deleted records
                if (docCache.delItems) {
                    bulkDelCSOs(docCache.delItems);
                }
                // Existing new records
                if (docCache.newItems) {
                    bulkAddCSOs(docCache.newItems);
                }
                // Existing updated records
                if (docCache.updateItems) {
                    bulkUpdateCSOs(docCache.updateItems);
                }
            }
            // Update timestamp
            updateDataTs(dataName, docCache.resultTs);
        }
    }
}
// Bulk add
function bulkAddCSOs(csos: ConstructionSiteOption[]) {
    if (Array.isArray(csos) && csos.length === 0) {
        return
    }
    csos.forEach(cso => {
        const params = [cso.id, cso.code, cso.name, cso.ts, JSON.stringify(cso)];
        const sqlStr = `insert into cso(id,code,name,ts,value) values(?,?,?,?,?)`;
        executeSQLWithParams(sqlStr, params);
    });
};
// Bulk delete
function bulkDelCSOs(csos: ConstructionSiteOption[]) {
    if (Array.isArray(csos) && csos.length === 0) {
        return
    }
    csos.forEach(cso => {
        const params = [cso.id];
        const sqlStr = `delete from cso where id=?`;
        executeSQLWithParams(sqlStr, params);
    });
}
// Bulk update
function bulkUpdateCSOs(csos: ConstructionSiteOption[]) {
    if (Array.isArray(csos) && csos.length === 0) {
        return
    }
    csos.forEach(cso => {
        const params = [cso.code, cso.name, cso.ts, JSON.stringify(cso), cso.id];
        const sqlStr = `update cso set code=?,name=?,ts=?,value=? where id=?`;
        const { rows } = executeSQLWithParams(sqlStr, params);
    });
}
