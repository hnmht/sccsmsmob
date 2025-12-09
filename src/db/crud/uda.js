import { reqGetUDDAll,reqGetUDDCache } from "../../api/userDefineDoc";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "userdefinedoc";

export async function initUDDCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);
    if (ts === "") {//没有ts
        const res = await reqGetUDDAll(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddUDDs(res.data.data);
        } 
    } else {//存在ts
        const cacheRes = await reqGetUDDCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelUDDs(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddUDDs(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateUDDs(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelUDDs(udds) {
    if (Array.isArray(udds) && udds.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udds.forEach(udd => {
        let sqlStr = `delete from userdefinedoc where id=${udd.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from userdefinedoc_recent where id=${udd.id}`;
        executeQuery(sqlStrRec);
    });
}
//批量修改
function bulkUpdateUDDs(udds) {
    if (Array.isArray(udds) && udds.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udds.forEach(udd => {
        let sqlStr = `update userdefinedoc set docclass_id=${udd.docclass.id},ts='${udd.ts}',value='${JSON.stringify(udd)}' where id=${udd.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `update userdefinedoc_recent set docclass_id=${udd.docclass.id},ts='${udd.ts}',value='${JSON.stringify(udd)}' where id=${udd.id}`;
        executeQuery(sqlStrRec);
    });
}

//增加最近
export function addUDDRecent(udd) {    
    let sqlStr = `insert or ignore into userdefinedoc_recent(id,docclass_id,ts,value) values(${udd.id},${udd.docclass.id},'${udd.ts}','${JSON.stringify(udd)}')`;
    executeQuery(sqlStr);
}
//删除最近
export function delUDDRecent(udd) {
    let sqlStr = `delete from userdefinedoc_recent where id=${udd.id}`;
    executeQuery(sqlStr);
}

//获取最近
export function getUDDRecent(classid) {
    let sqlStr = `select value from userdefinedoc_recent where docclass_id=${classid} order by autoid desc`;
    let { rows } = executeQuery(sqlStr);
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
    let { rows } = executeQuery(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}