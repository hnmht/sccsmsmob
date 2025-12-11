import { reqGetSimpDCList,reqGetSimpDCCache } from "../../api/documentClass";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "documentclass";

export async function initDCCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts    
        const res = await reqGetSimpDCList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddDCs(res.data);
        }
    } else {//存在ts   
        const cacheRes = await reqGetSimpDCCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            // console.log("docCache:", docCache);
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelDCs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddDCs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateDCs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }
}
//批量增加
function bulkAddDCs(dcs) {
    if (Array.isArray(dcs) && dcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    dcs.forEach(dc => {
        let sqlStr = `insert into documentclass(id,name,ts,value) values(${dc.id},'${dc.name}','${dc.ts}','${JSON.stringify(dc)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelDCs(dcs) {
    if (Array.isArray(dcs) && dcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    dcs.forEach(dc => {
        let sqlStr = `delete from documentclass where id=${dc.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from documentclass_recent where id=${dc.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateDCs(dcs) {
    if (Array.isArray(dcs) && dcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    dcs.forEach(dc => {
        let sqlStr = `update documentclass set name='${dc.name}',ts='${dc.ts}',value='${JSON.stringify(dc)}' where id=${dc.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update documentclass_recent set name='${dc.name}',ts='${dc.ts}',value='${JSON.stringify(dc)}' where id=${dc.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近
export function addDCRecent(dc) {
    let sqlStr = `insert or ignore into documentclass_recent(id,name,ts,value) values(${dc.id},'${dc.name}','${dc.ts}','${JSON.stringify(dc)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delDCRecent(dc) {
    let sqlStr = `delete from documentclass_recent where id=${dc.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getDCRecent() {
    let sqlStr = `select value from documentclass_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
