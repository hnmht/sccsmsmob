import { reqGetSimpEICList,reqGetSimpEICCache } from "../../api/exectiveItemClass";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "exectiveitemclass";

export async function initEICCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts
        const res = await reqGetSimpEICList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddEics(res.data);
        } 
        
    } else {//存在ts
        const cacheRes = await reqGetSimpEICCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelEics(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddEics(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateEics(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        } 
    }

}
//批量增加执行项目类别
function bulkAddEics(eics) {
    if (Array.isArray(eics) && eics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    eics.forEach(eic => {
        let sqlStr = `insert into exectiveitemclass(id,name,ts,value) values(${eic.id},'${eic.name}','${eic.ts}','${JSON.stringify(eic)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除执行项目类别
function bulkDelEics(eics) {
    if (Array.isArray(eics) && eics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    eics.forEach(eic => {
        let sqlStr = `delete from exectiveitemclass where id=${eic.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from exectiveitemclass_recent where id=${eic.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateEics(eics) {
    if (Array.isArray(eics) && eics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    eics.forEach(eic => {
        let sqlStr = `update exectiveitemclass set name='${eic.name}',ts='${eic.ts}',value='${JSON.stringify(eic)}' where id=${eic.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update exectiveitemclass_recent set name='${eic.name}',ts='${eic.ts}',value='${JSON.stringify(eic)}' where id=${eic.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近
export function addEICRecent(eic) {
    let sqlStr = `insert or ignore into exectiveitemclass_recent(id,name,ts,value) values(${eic.id},'${eic.name}','${eic.ts}','${JSON.stringify(eic)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delEICRecent(eic) {
    let sqlStr = `delete from exectiveitemclass_recent where id=${eic.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getEICRecent() {
    let sqlStr = `select value from exectiveitemclass_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}



