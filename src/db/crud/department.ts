import { reqGetSimpDepts, reqGetSimpDeptsCache } from "../../api/department";
import { getEmptySimpDept } from "../../dataType/dataZero/department";
import { SimpDept, SimpDeptCache } from "../../dataType/types/department";
import { MasterDataRepository } from "./respository";

// Simple Department 
export const simpDeptRepo = new MasterDataRepository<SimpDept, SimpDeptCache>({
    table: "department",
    recentTable: "department_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "ts": "ts",
    },
    emptyFn:getEmptySimpDept,
    convertToFront: (data: SimpDept[]) => data,
    getFullData: reqGetSimpDepts,
    getCacheData: reqGetSimpDeptsCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});

/* const dataName = "department";

export async function initDepartmentCache() {
    // Get latest ts from db 
    const ts = queryDataTs(dataName);
    if (ts === "") { // No ts found, first time sync
        const res = await reqGetSimpDepts(false);
        if (res.status) {
            const latestTs:string = res.data[0].ts;
            // bulk add departments into db
            bulkAddDepts(res.data);
            // Save latest ts into db
            addDataTs(dataName, latestTs);
        }
    } else {
        // Get cache updates from server
        const emptyCache: SimpDeptCache = getEmptyQueryParams<SimpDeptCache>(ts);
        const cacheRes = await reqGetSimpDeptsCache(emptyCache, false);
        if (cacheRes.status) {
            const docCache: SimpDeptCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                // exists deleted records
                if (docCache.delItems) {
                    bulkDelDepts(docCache.delItems);
                }
                // exists new records
                if (docCache.newItems) {
                    bulkAddDepts(docCache.newItems);
                }
                // exists updated records
                if (docCache.updateItems) {
                    bulkUpdateDepts(docCache.updateItems);
                }
            }
            // update latest ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }
}
// Bulk add departments
function bulkAddDepts(depts: SimpDept[]) {
    if (Array.isArray(depts) && depts.length === 0) {
        return
    }
    depts.forEach(dept => {
        let sqlStr: string = `insert into department(id,code,name,ts,value) values(?,?,?,?,?)`;
        let params = [dept.id, dept.code, dept.name, dept.ts, JSON.stringify(dept)];
        executeSQLWithParams(sqlStr, params);
    });
};
// Bulk delete departments
function bulkDelDepts(depts: SimpDept[]) {
    if (Array.isArray(depts) && depts.length === 0) {
        return
    }
    depts.forEach(dept => {
        const sqlStr = `delete from department where id=?`;
        const params = [dept.id];
        executeSQLWithParams(sqlStr, params);
        // also delete from recent table
        const sqlStrRec = `delete from department_recent where id=?`;
        executeSQLWithParams(sqlStrRec, params);
    });
}

// Bulk update departments
function bulkUpdateDepts(depts: SimpDept[]) {
    if (Array.isArray(depts) && depts.length === 0) {
        return
    }
    depts.forEach(dept => {
        // update main table
        const sqlStr = `update department set code=?,name=?,ts=?,value=? where id=?`;
        const params = [dept.code, dept.name, dept.ts, JSON.stringify(dept), dept.id];
        executeSQLWithParams(sqlStr, params);
        // also update recent table
        const sqlStrRec = `update department_recent set code=?,name=?,ts=?,value=? where id=?`;
        executeSQLWithParams(sqlStrRec, params);
    });
}

// Add recent used department
export function addDeptRecent(dept: SimpDept) {
    const sqlStr = `insert or ignore into department_recent(id,code,name,ts,value) values(?,?,?,?,?)`;
    const params = [dept.id, dept.code, dept.name, dept.ts, JSON.stringify(dept)];
    executeSQLWithParams(sqlStr, params);
}
// Delete recent used department
export function delDeptRecent(dept: SimpDept) {
    const sqlStr = `delete from department_recent where id=?`;
    const params = [dept.id];
    executeSQLWithParams(sqlStr, params);
}

// Get recent used departments
export function getDeptRecent() : SimpDept[] {
    let sqlStr = `select value from department_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs: SimpDept[] = [];
    if (rows && rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
} */

