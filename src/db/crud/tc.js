import { reqGetTCList, reqGetTCCache } from "../../api/trainCourse";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "traincourse";
const tableName = "traincourse";
const recentTableName = "traincourse_recent";

export async function initTCCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts    
        const res = await reqGetTCList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddTCs(res.data);
        }
    } else {//存在ts   
        const cacheRes = await reqGetTCCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            // console.log("docCache:", docCache);
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelTCs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddTCs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateTCs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }
}
//批量增加
function bulkAddTCs(tcs) {
    if (Array.isArray(tcs) && tcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    tcs.forEach(tc => {
        let sqlStr = `insert into ${tableName}(id,name,ts,value) values(${tc.id},'${tc.name}','${tc.ts}','${JSON.stringify(tc)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelTCs(tcs) {
    if (Array.isArray(tcs) && tcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    tcs.forEach(tc => {
        let sqlStr = `delete from ${tableName} where id=${tc.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from ${recentTableName} where id=${tc.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateTCs(tcs) {
    if (Array.isArray(tcs) && tcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    tcs.forEach(tc => {
        let sqlStr = `update ${tableName} set name='${tc.name}',ts='${tc.ts}',value='${JSON.stringify(tc)}' where id=${tc.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update ${recentTableName} set name='${tc.name}',ts='${tc.ts}',value='${JSON.stringify(tc)}' where id=${tc.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近
export function addTCRecent(tc) {
    let sqlStr = `insert or ignore into ${recentTableName}(id,name,ts,value) values(${tc.id},'${tc.name}','${tc.ts}','${JSON.stringify(tc)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delTCRecent(tc) {
    let sqlStr = `delete from ${recentTableName} where id=${tc.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getTCRecent() {
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
