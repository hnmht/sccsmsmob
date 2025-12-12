import { reqGetSimpCSCList, reqGetSimpCSCCache } from "../../api/csc";
import { getEmptyQueryParams } from "../../dataType/dataZero/pubic";
import { SimpCSC, SimpCSCCache } from "../../dataType/types/csc";
import { queryDataTs, updateDataTs, addDataTs, executeSQL, executeSQLWithParams } from "../db";

const dataName = "csc";

export async function initCSCCache() {
    // Get last ts
    let ts = queryDataTs(dataName);
    if (ts === "") {
        const res = await reqGetSimpCSCList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            // Save latest ts to db
            addDataTs(dataName, latestTs);
            // Bulk add all cscs
            bulkAddCSCs(res.data);
        }

    } else {
        const emptyParams = getEmptyQueryParams<SimpCSCCache>(ts);
        const cacheRes = await reqGetSimpCSCCache(emptyParams, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                // exists deleted records
                if (docCache.delItems) {
                    bulkDelCSCs(docCache.delItems);
                }
                // exists new records
                if (docCache.newItems) {
                    bulkAddCSCs(docCache.newItems);
                }
                // exists updated records
                if (docCache.updateItems) {
                    bulkUpdateCSCs(docCache.updateItems);
                }
            }
            // update latest ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }

}
// Bulk add
function bulkAddCSCs(cscs: SimpCSC[]) {
    if (Array.isArray(cscs) && cscs.length === 0) {
        return
    }
    cscs.forEach(csc => {
        const sqlStrRec = `insert or ignore into csc_recent(id,name,ts,value) values(?,?,?,?)`;
        const params = [csc.id, csc.name, csc.ts, JSON.stringify(csc)];
        executeSQLWithParams(sqlStrRec, params);
    });
};
// Bulk delete
function bulkDelCSCs(cscs: SimpCSC[]) {
    if (Array.isArray(cscs) && cscs.length === 0) {
        return
    }
    cscs.forEach(csc => {
        const params = [csc.id];
        const sqlStr = `delete from csc where id=?`;
        executeSQLWithParams(sqlStr, params);
        const sqlStrRec = `delete from csc_recent where id=?`;
        executeSQLWithParams(sqlStrRec, params);
    });
}
// Bulk update
function bulkUpdateCSCs(cscs: SimpCSC[]) {
    if (Array.isArray(cscs) && cscs.length === 0) {
        return
    }
    cscs.forEach(csc => {
        const params = [csc.name, csc.ts, JSON.stringify(csc), csc.id];
        const sqlStr = `update csc set name=?,ts=?,value=? where id=?`;
        executeSQLWithParams(sqlStr, params);
        const sqlStrRec = `update csc_recent set name=?,ts=?,value=? where id=?`;
        executeSQLWithParams(sqlStrRec, params);
    });
}
// Add recent
export function addCSCRecent(csc: SimpCSC) {
    const params = [csc.id, csc.name, csc.ts, JSON.stringify(csc)];
    const sqlStr = `insert or ignore into csc_recent(id,name,ts,value) values(?,?,?,?)`;
    executeSQLWithParams(sqlStr, params);
}
// Delete recent
export function delCSCRecent(csc: SimpCSC) {
    const params = [csc.id];
    const sqlStr = `delete from csc_recent where id=?`;
    executeSQLWithParams(sqlStr, params);
}
// Get recent
export function getCSCRecent(): SimpCSC[] {
    let sqlStr = `select value from csc_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs: SimpCSC[] = [];
    if (rows && rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
