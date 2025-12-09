import { reqGetUDCList, reqGetUDCsCache } from "../../api/userDefineClass";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "userdefineclass";

export async function initUDCCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);
    if (ts === "") {//没有ts
        const res = await reqGetUDCList(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddUDCs(res.data.data);
        }
    } else {//存在ts
        const cacheRes = await reqGetUDCsCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelUDCs(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddUDCs(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateUDCs(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelUDCs(udcs) {
    if (Array.isArray(udcs) && udcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udcs.forEach(udc => {
        let sqlStr = `delete from userdefineclass where id=${udc.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from userdefineclass_recent where id=${udc.id}`;
        executeQuery(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateUDCs(udcs) {
    if (Array.isArray(udcs) && udcs.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    udcs.forEach(udc => {
        let sqlStr = `update userdefineclass set name='${udc.name}',ts='${udc.ts}',value='${JSON.stringify(udc)}' where id=${udc.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `update userdefineclass_recent set name='${udc.name}',ts='${udc.ts}',value='${JSON.stringify(udc)}' where id=${udc.id}`;
        executeQuery(sqlStrRec);
    });
}

//增加最近
export function addUDCRecent(udc) {
    let sqlStr = `insert or ignore into userdefineclass_recent(id,name,ts,value) values(${udc.id},'${udc.name}','${udc.ts}','${JSON.stringify(udc)}')`;
    executeQuery(sqlStr);
}
//删除最近
export function delUDCRecent(udc) {
    let sqlStr = `delete from userdefineclass_recent where id=${udc.id}`;
    executeQuery(sqlStr);
}

//获取最近
export function getUDCRecent() {
    let sqlStr = `select value from userdefineclass_recent order by autoid desc`;
    let { rows } = executeQuery(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
