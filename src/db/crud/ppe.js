import { reqGetLPList,reqGetLPCache } from "../../api/laborProtection";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "laborprotection";
const tableName = "laborprotection";
const recentTableName = "laborprotection_recent";

export async function initLPCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);
    if (ts === "") {//没有ts    
        const res = await reqGetLPList(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddLPs(res.data.data);
        }
    } else {//存在ts   
        const cacheRes = await reqGetLPCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            // console.log("docCache:", docCache);
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelLPs(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddLPs(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateLPs(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelLPs(lps) {
    if (Array.isArray(lps) && lps.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    lps.forEach(lp => {
        let sqlStr = `delete from ${tableName} where id=${lp.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from ${recentTableName} where id=${lp.id}`;
        executeQuery(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateLPs(lps) {
    if (Array.isArray(lps) && lps.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    lps.forEach(lp => {
        let sqlStr = `update ${tableName} set name='${lp.name}',ts='${lp.ts}',value='${JSON.stringify(lp)}' where id=${lp.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `update ${recentTableName} set name='${lp.name}',ts='${lp.ts}',value='${JSON.stringify(lp)}' where id=${lp.id}`;
        executeQuery(sqlStrRec);
    });
}

//增加最近
export function addLPRecent(lp) {
    let sqlStr = `insert or ignore into ${recentTableName}(id,name,ts,value) values(${lp.id},'${lp.name}','${lp.ts}','${JSON.stringify(lp)}')`;
    executeQuery(sqlStr);
}
//删除最近
export function delLPRecent(lp) {
    let sqlStr = `delete from ${recentTableName} where id=${lp.id}`;
    executeQuery(sqlStr);
}

//获取最近
export function getLPRecent() {
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
