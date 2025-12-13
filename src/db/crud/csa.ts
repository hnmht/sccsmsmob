import { reqGetCSList, reqGetCSCache } from "../../api/csa";
import { ConstructionSite, ConstructionSiteCache } from "../../dataType/types/csa";
import { LocalRepository } from "./respository";

// Construction Site
export const CSRepo = new LocalRepository<ConstructionSite, ConstructionSiteCache>({
    table: "csa",
    recentTable: "csa_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "cscid": "csc.id",
        "status": "status",
        "ts": "ts",
    },
    getFullData: reqGetCSList,
    getCacheData: reqGetCSCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});

/* const dataName = "csa";

export async function initCSCache() {
    // Get latest ts from db
    let ts = queryDataTs(dataName);
    if (ts === "") {
        const res = await reqGetCSList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            // Save latest ts into db
            addDataTs(dataName, latestTs);
            // bulk add CSs into db
            bulkAddCSs(res.data);
        }

    } else {
        // Get cache updates from server
        const emptyCache: ConstructionSiteCache = getEmptyQueryParams<ConstructionSiteCache>(ts);
        const cacheRes = await reqGetCSCache(emptyCache, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                // exists deleted records
                if (docCache.delItems) {
                    bulkDelCSs(docCache.delItems);
                }
                // exists new records
                if (docCache.newItems) {
                    bulkAddCSs(docCache.newItems);
                }
                // Exists updated records
                if (docCache.updateItems) {
                    bulkUpdateCSs(docCache.updateItems);
                }
            }
            // update latest ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }
}
// Bulk add
function bulkAddCSs(css: ConstructionSite[]) {
    if (Array.isArray(css) && css.length === 0) {
        return
    }
    css.forEach(cs => {
        const sqlStr = `insert into csa(id,code,name,cscid,ts,value) values(?,?,?,?,?,?)`;
        const params = [cs.id, cs.code, cs.name, cs.csc.id, cs.ts, JSON.stringify(cs)];
        executeSQLWithParams(sqlStr, params);
    });
};
// Bulk delete
function bulkDelCSs(css: ConstructionSite[]) {
    if (Array.isArray(css) && css.length === 0) {
        return
    }
    css.forEach(cs => {
        const sqlStr = `delete from csa where id=?`;
        const params = [cs.id];
        executeSQLWithParams(sqlStr, params);
        // also delete from recent table
        const sqlStrRec = `delete from csa_recent where id=?`;
        const paramsRec = [cs.id];
        executeSQLWithParams(sqlStrRec, paramsRec);
    });
}
// Bulk update
function bulkUpdateCSs(css: ConstructionSite[]) {
    if (Array.isArray(css) && css.length === 0) {
        return
    }
    css.forEach(cs => {
        const sqlStr = `update csa set code=?,name=?,cscid=?,ts=?,value=? where id=?`;
        const params = [cs.code, cs.name, cs.csc.id, cs.ts, JSON.stringify(cs), cs.id];
        executeSQLWithParams(sqlStr, params);
        // also update recent table
        const sqlStrRec = `update csa_recent set code=?,name=?,cscid=?,ts=?,value=? where id=?`;
        executeSQLWithParams(sqlStrRec, params);
    });
}

// Add recent using cs
export function addCSRecent(cs: ConstructionSite) {
    const sqlStr = `insert or ingore into csa_recent(id,code,name,cscid,ts,value) values(?,?,?,?,?,?)`;
    const params = [cs.id, cs.code, cs.name, cs.csc.id, cs.ts, JSON.stringify(cs)];
    executeSQLWithParams(sqlStr, params);

}
// Delete recent using cs
export function delCSRecent(cs: ConstructionSite) {
    const sqlStr = `delete from csa_recent where id=?`;
    const params = [cs.id];
    executeSQLWithParams(sqlStr, params);
}

// Get recent using cs
export function getCSRecent() : ConstructionSite[] {
    let sqlStr = `select value from csa_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs: ConstructionSite[] = [];
    if (rows && rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
} */
