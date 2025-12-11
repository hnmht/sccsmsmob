import { reqGetLPList,reqGetLPCache } from "../../api/laborProtection";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "laborprotection";
const tableName = "laborprotection";
const recentTableName = "laborprotection_recent";

export async function initLPCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts    
        const res = await reqGetLPList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddLPs(res.data);
        }
    } else {//存在ts   
        const cacheRes = await reqGetLPCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            // console.log("docCache:", docCache);
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelLPs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddLPs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateLPs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }
}
//批量增加
function bulkAddLPs(lps) {
    if (Array.isArray(lps) && lps.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    lps.forEach(lp => {
        let sqlStr = `insert into ${tableName}(id,name,ts,value) values(${lp.id},'${lp.name}','${lp.ts}','${JSON.stringify(lp)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelLPs(lps) {
    if (Array.isArray(lps) && lps.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    lps.forEach(lp => {
        let sqlStr = `delete from ${tableName} where id=${lp.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from ${recentTableName} where id=${lp.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateLPs(lps) {
    if (Array.isArray(lps) && lps.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    lps.forEach(lp => {
        let sqlStr = `update ${tableName} set name='${lp.name}',ts='${lp.ts}',value='${JSON.stringify(lp)}' where id=${lp.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update ${recentTableName} set name='${lp.name}',ts='${lp.ts}',value='${JSON.stringify(lp)}' where id=${lp.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近
export function addLPRecent(lp) {
    let sqlStr = `insert or ignore into ${recentTableName}(id,name,ts,value) values(${lp.id},'${lp.name}','${lp.ts}','${JSON.stringify(lp)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delLPRecent(lp) {
    let sqlStr = `delete from ${recentTableName} where id=${lp.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getLPRecent() {
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
