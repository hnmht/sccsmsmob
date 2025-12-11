import { reqGetCSList, reqGetCSCache } from "../../api/csa";
import { getEmptyQueryParams } from "../../dataType/dataZero/pubic";
import { ConstructionSite, ConstructionSiteCache } from "../../dataType/types/csa";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "csa";

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
                if (docCache.delItems !== null) {
                    bulkDelCSs(docCache.delItems);
                }
                // exists new records
                if (docCache.newItems !== null) {
                    bulkAddCSs(docCache.newItems);
                }
                // Exists updated records
                if (docCache.updateItems !== null) {
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
        let sqlStr = `insert into csa(id,code,name,cscid,ts,value) values(${cs.id},'${cs.code}','${cs.name}',${cs.csc.id},'${cs.ts}','${JSON.stringify(cs)}')`;
        executeSQL(sqlStr);
    });
};
// Bulk delete
function bulkDelCSs(css: ConstructionSite[]) {
    if (Array.isArray(css) && css.length === 0) {
        return
    }
    css.forEach(cs => {
        let sqlStr = `delete from csa where id=${cs.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from csa_recent where id=${cs.id}`;
        executeSQL(sqlStrRec);
    });
}
// Bulk update
function bulkUpdateCSs(css: ConstructionSite[]) {
    if (Array.isArray(css) && css.length === 0) {
        return
    }
    css.forEach(cs => {
        let sqlStr = `update csa set code='${cs.code}',name='${cs.name}',cscid=${cs.csc.id},ts='${cs.ts}',value='${JSON.stringify(cs)}' where id=${cs.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update csa_recent set code='${cs.code}',name='${cs.name}',cscid=${cs.csc.id},ts='${cs.ts}',value='${JSON.stringify(cs)}' where id=${cs.id}`;
        executeSQL(sqlStrRec);
    });
}

// Add recent using cs
export function addCSRecent(cs: ConstructionSite) {
    let sqlStr = `insert or ignore into 
     csa_recent(id,code,name,cscid,ts,value) 
     values(${cs.id},'${cs.code}','${cs.name}',${cs.csc.id},'${cs.ts}','${JSON.stringify(cs)}')`;
    executeSQL(sqlStr);
}
// Delete recent using cs
export function delCSRecent(cs: ConstructionSite) {
    let sqlStr = `delete from csa_recent where id=${cs.id}`;
    executeSQL(sqlStr);
}

// Get recent using cs
export function getCSRecent() {
    let sqlStr = `select value from csa_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs: ConstructionSite[] = [];
    if (rows && rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
