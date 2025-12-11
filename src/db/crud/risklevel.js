import { reqGetRLList, reqGetRLsCache } from "../../api/riskLevel";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "risklevel";

export async function initRLCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);  
    if (ts === "") {//没有ts    
        const res = await reqGetRLList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddRLs(res.data);
        }
    } else {//存在ts   
        const cacheRes = await reqGetRLsCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            // console.log("docCache:", docCache);
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelRLs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddRLs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateRLs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        } 
    }
}
//批量增加
function bulkAddRLs(rls) {
    if (Array.isArray(rls) && rls.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    rls.forEach(rl => {
        let sqlStr = `insert into risklevel(id,name,ts,value) values(${rl.id},'${rl.name}','${rl.ts}','${JSON.stringify(rl)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelRLs(rls) {
    if (Array.isArray(rls) && rls.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    rls.forEach(rl => {
        let sqlStr = `delete from risklevel where id=${rl.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from risklevel_recent where id=${rl.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateRLs(rls) {
    if (Array.isArray(rls) && rls.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    rls.forEach(rl => {
        let sqlStr = `update risklevel set name='${rl.name}',ts='${rl.ts}',value='${JSON.stringify(rl)}' where id=${rl.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update risklevel_recent set name='${rl.name}',ts='${rl.ts}',value='${JSON.stringify(rl)}' where id=${rl.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近
export function addRLRecent(rl) {
    let sqlStr = `insert or ignore into risklevel_recent(id,name,ts,value) values(${rl.id},'${rl.name}','${rl.ts}','${JSON.stringify(rl)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delRLRecent(rl) {
    let sqlStr = `delete from risklevel_recent where id=${rl.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getRLRecent() {
    let sqlStr = `select value from risklevel_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
