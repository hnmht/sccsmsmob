import { reqGetUDDAll,reqGetUDDCache } from "../../api/userDefineDoc";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "userdefinedoc";

export async function initUDDCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts
        const res = await reqGetUDDAll(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddUDDs(res.data);
        } 
    } else {//存在ts
        const cacheRes = await reqGetUDDCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelUDDs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddUDDs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateUDDs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }
}
//批量增加
function bulkAddUDDs(udds) {
    if (Array.isArray(udds) && udds.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udds.forEach(udd => {
        let sqlStr = `insert into userdefinedoc(id,docclass_id,ts,value) values(${udd.id},${udd.docclass.id},'${udd.ts}','${JSON.stringify(udd)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelUDDs(udds) {
    if (Array.isArray(udds) && udds.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udds.forEach(udd => {
        let sqlStr = `delete from userdefinedoc where id=${udd.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from userdefinedoc_recent where id=${udd.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改
function bulkUpdateUDDs(udds) {
    if (Array.isArray(udds) && udds.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udds.forEach(udd => {
        let sqlStr = `update userdefinedoc set docclass_id=${udd.docclass.id},ts='${udd.ts}',value='${JSON.stringify(udd)}' where id=${udd.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update userdefinedoc_recent set docclass_id=${udd.docclass.id},ts='${udd.ts}',value='${JSON.stringify(udd)}' where id=${udd.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近
export function addUDDRecent(udd) {    
    let sqlStr = `insert or ignore into userdefinedoc_recent(id,docclass_id,ts,value) values(${udd.id},${udd.docclass.id},'${udd.ts}','${JSON.stringify(udd)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delUDDRecent(udd) {
    let sqlStr = `delete from userdefinedoc_recent where id=${udd.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getUDDRecent(classid) {
    let sqlStr = `select value from userdefinedoc_recent where docclass_id=${classid} order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}

//根据类别获取自定义档案缓存
export function getUDDByClassID(classid) {
    let sqlStr = `select value from userdefinedoc where docclass_id=${classid} order by ts desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}