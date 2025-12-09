import { reqGetOPList,reqGetOPCache } from "../../api/operatingPost";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "operatingpost";
const tableName = "operatingpost";
const recentTableName = "operatingpost_recent";

export async function initOPCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);
    if (ts === "") {//没有ts    
        const res = await reqGetOPList(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddOPs(res.data.data);
        }
    } else {//存在ts   
        const cacheRes = await reqGetOPCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            // console.log("docCache:", docCache);
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelOPs(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddOPs(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateOPs(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelOPs(ops) {
    if (Array.isArray(ops) && ops.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    ops.forEach(op => {
        let sqlStr = `delete from ${tableName} where id=${op.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from ${recentTableName} where id=${op.id}`;
        executeQuery(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateOPs(ops) {
    if (Array.isArray(ops) && ops.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    ops.forEach(op => {
        let sqlStr = `update ${tableName} set name='${op.name}',ts='${op.ts}',value='${JSON.stringify(op)}' where id=${op.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `update ${recentTableName} set name='${op.name}',ts='${op.ts}',value='${JSON.stringify(op)}' where id=${op.id}`;
        executeQuery(sqlStrRec);
    });
}

//增加最近
export function addOPRecent(op) {
    let sqlStr = `insert or ignore into ${recentTableName}(id,name,ts,value) values(${op.id},'${op.name}','${op.ts}','${JSON.stringify(op)}')`;
    executeQuery(sqlStr);
}
//删除最近
export function delOPRecent(op) {
    let sqlStr = `delete from ${recentTableName} where id=${op.id}`;
    executeQuery(sqlStr);
}

//获取最近
export function getOPRecent() {
    let sqlStr = `select value from ${recentTableName} order by autoid desc`;
    let { rows } = executeQuery(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
