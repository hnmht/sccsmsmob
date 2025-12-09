import { reqGetTCList, reqGetTCCache } from "../../api/trainCourse";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "traincourse";
const tableName = "traincourse";
const recentTableName = "traincourse_recent";

export async function initTCCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);
    if (ts === "") {//没有ts    
        const res = await reqGetTCList(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddTCs(res.data.data);
        }
    } else {//存在ts   
        const cacheRes = await reqGetTCCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            // console.log("docCache:", docCache);
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelTCs(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddTCs(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateTCs(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelTCs(tcs) {
    if (Array.isArray(tcs) && tcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    tcs.forEach(tc => {
        let sqlStr = `delete from ${tableName} where id=${tc.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from ${recentTableName} where id=${tc.id}`;
        executeQuery(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateTCs(tcs) {
    if (Array.isArray(tcs) && tcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    tcs.forEach(tc => {
        let sqlStr = `update ${tableName} set name='${tc.name}',ts='${tc.ts}',value='${JSON.stringify(tc)}' where id=${tc.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `update ${recentTableName} set name='${tc.name}',ts='${tc.ts}',value='${JSON.stringify(tc)}' where id=${tc.id}`;
        executeQuery(sqlStrRec);
    });
}

//增加最近
export function addTCRecent(tc) {
    let sqlStr = `insert or ignore into ${recentTableName}(id,name,ts,value) values(${tc.id},'${tc.name}','${tc.ts}','${JSON.stringify(tc)}')`;
    executeQuery(sqlStr);
}
//删除最近
export function delTCRecent(tc) {
    let sqlStr = `delete from ${recentTableName} where id=${tc.id}`;
    executeQuery(sqlStr);
}

//获取最近
export function getTCRecent() {
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
