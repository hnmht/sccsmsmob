import { reqGetOPList,reqGetOPCache } from "../../api/operatingPost";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "operatingpost";
const tableName = "operatingpost";
const recentTableName = "operatingpost_recent";

export async function initOPCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts    
        const res = await reqGetOPList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddOPs(res.data);
        }
    } else {//存在ts   
        const cacheRes = await reqGetOPCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            // console.log("docCache:", docCache);
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelOPs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddOPs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateOPs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }
}
//批量增加
function bulkAddOPs(ops) {
    if (Array.isArray(ops) && ops.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    ops.forEach(op => {
        let sqlStr = `insert into ${tableName}(id,name,ts,value) values(${op.id},'${op.name}','${op.ts}','${JSON.stringify(op)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelOPs(ops) {
    if (Array.isArray(ops) && ops.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    ops.forEach(op => {
        let sqlStr = `delete from ${tableName} where id=${op.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from ${recentTableName} where id=${op.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateOPs(ops) {
    if (Array.isArray(ops) && ops.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    ops.forEach(op => {
        let sqlStr = `update ${tableName} set name='${op.name}',ts='${op.ts}',value='${JSON.stringify(op)}' where id=${op.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update ${recentTableName} set name='${op.name}',ts='${op.ts}',value='${JSON.stringify(op)}' where id=${op.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近
export function addOPRecent(op) {
    let sqlStr = `insert or ignore into ${recentTableName}(id,name,ts,value) values(${op.id},'${op.name}','${op.ts}','${JSON.stringify(op)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delOPRecent(op) {
    let sqlStr = `delete from ${recentTableName} where id=${op.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getOPRecent() {
    let sqlStr = `select value from ${recentTableName} order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
