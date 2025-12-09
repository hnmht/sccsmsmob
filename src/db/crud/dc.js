import { reqGetSimpDCList,reqGetSimpDCCache } from "../../api/documentClass";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "documentclass";

export async function initDCCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);
    if (ts === "") {//没有ts    
        const res = await reqGetSimpDCList(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddDCs(res.data.data);
        }
    } else {//存在ts   
        const cacheRes = await reqGetSimpDCCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            // console.log("docCache:", docCache);
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelDCs(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddDCs(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateDCs(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelDCs(dcs) {
    if (Array.isArray(dcs) && dcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    dcs.forEach(dc => {
        let sqlStr = `delete from documentclass where id=${dc.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from documentclass_recent where id=${dc.id}`;
        executeQuery(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateDCs(dcs) {
    if (Array.isArray(dcs) && dcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    dcs.forEach(dc => {
        let sqlStr = `update documentclass set name='${dc.name}',ts='${dc.ts}',value='${JSON.stringify(dc)}' where id=${dc.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `update documentclass_recent set name='${dc.name}',ts='${dc.ts}',value='${JSON.stringify(dc)}' where id=${dc.id}`;
        executeQuery(sqlStrRec);
    });
}

//增加最近
export function addDCRecent(dc) {
    let sqlStr = `insert or ignore into documentclass_recent(id,name,ts,value) values(${dc.id},'${dc.name}','${dc.ts}','${JSON.stringify(dc)}')`;
    executeQuery(sqlStr);
}
//删除最近
export function delDCRecent(dc) {
    let sqlStr = `delete from documentclass_recent where id=${dc.id}`;
    executeQuery(sqlStr);
}

//获取最近
export function getDCRecent() {
    let sqlStr = `select value from documentclass_recent order by autoid desc`;
    let { rows } = executeQuery(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
