import { reqGetSimpDepts, reqGetSimpDeptsCache } from "../../api/department";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const docName = "department";

export async function initDepartmentCache() {
    //获取最新档案ts
    let ts = queryDataTs(docName);
    if (ts === "") {//没有ts
        const res = await reqGetSimpDepts(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDataTs(docName, latestTs);
            //批量增加部门档案
            bulkAddDepts(res.data.data);
        }
    } else {//存在ts
        const cacheRes = await reqGetSimpDeptsCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelDepts(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddDepts(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateDepts(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDataTs(docName, docCache.resultts);
        }
    }
}
//批量增加部门
function bulkAddDepts(depts) {
    if (Array.isArray(depts) && depts.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    depts.forEach(dept => {
        let sqlStr = `insert into department(id,code,name,ts,value) values(${dept.id},'${dept.code}','${dept.name}','${dept.ts}','${JSON.stringify(dept)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除部门
function bulkDelDepts(depts) {
    if (Array.isArray(depts) && depts.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    depts.forEach(dept => {
        let sqlStr = `delete from department where id=${dept.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from department_recent where id=${dept.id}`;
        executeSQL(sqlStrRec);
    });
}

//批量修改部门
function bulkUpdateDepts(depts) {
    if (Array.isArray(depts) && depts.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    depts.forEach(dept => {
        let sqlStr = `update department set code='${dept.code}',name='${dept.name}',ts='${dept.ts}',value='${JSON.stringify(dept)}' where id=${dept.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update department_recent set code='${dept.code}',name='${dept.name}',ts='${dept.ts}',value='${JSON.stringify(dept)}' where id=${dept.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近使用部门
export function addDeptRecent(dept) {
    let sqlStr = `insert or ignore into 
    department_recent(id,code,name,ts,value) 
    values(${dept.id},'${dept.code}','${dept.name}','${dept.ts}','${JSON.stringify(dept)}')`;

    executeSQL(sqlStr);
}
//删除最近使用部门
export function delDeptRecent(dept) {
    let sqlStr = `delete from department_recent where id=${dept.id}`;
    executeSQL(sqlStr);
}

//获取最近使用部门
export function getDeptRecent() {
    let sqlStr = `select value from department_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}

