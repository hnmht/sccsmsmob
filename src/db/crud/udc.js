import { reqGetUDCList, reqGetUDCsCache } from "../../api/userDefineClass";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "userdefineclass";

export async function initUDCCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts
        const res = await reqGetUDCList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddUDCs(res.data);
        }
    } else {//存在ts
        const cacheRes = await reqGetUDCsCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelUDCs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddUDCs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateUDCs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }
}
//批量增加
function bulkAddUDCs(udcs) {
    if (Array.isArray(udcs) && udcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udcs.forEach(udc => {
        let sqlStr = `insert into userdefineclass(id,name,ts,value) values(${udc.id},'${udc.name}','${udc.ts}','${JSON.stringify(udc)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelUDCs(udcs) {
    if (Array.isArray(udcs) && udcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udcs.forEach(udc => {
        let sqlStr = `delete from userdefineclass where id=${udc.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from userdefineclass_recent where id=${udc.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateUDCs(udcs) {
    if (Array.isArray(udcs) && udcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udcs.forEach(udc => {
        let sqlStr = `update userdefineclass set name='${udc.name}',ts='${udc.ts}',value='${JSON.stringify(udc)}' where id=${udc.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update userdefineclass_recent set name='${udc.name}',ts='${udc.ts}',value='${JSON.stringify(udc)}' where id=${udc.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近
export function addUDCRecent(udc) {
    let sqlStr = `insert or ignore into userdefineclass_recent(id,name,ts,value) values(${udc.id},'${udc.name}','${udc.ts}','${JSON.stringify(udc)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delUDCRecent(udc) {
    let sqlStr = `delete from userdefineclass_recent where id=${udc.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getUDCRecent() {
    let sqlStr = `select value from userdefineclass_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
