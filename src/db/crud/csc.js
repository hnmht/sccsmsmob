import { reqGetSimpSICList, reqGetSimpSICCache } from "../../api/sceneItemClass";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "sceneitemclass";

export async function initSICCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts
        const res = await reqGetSimpSICList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddSICs(res.data);
        } 
        
    } else {//存在ts
        const cacheRes = await reqGetSimpSICCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelSICs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddSICs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateSICs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        }
    }

}
//批量增加
function bulkAddSICs(sics) {
    if (Array.isArray(sics) && sics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sics.forEach(sic => {
        let sqlStr = `insert into sceneitemclass(id,name,ts,value) values(${sic.id},'${sic.name}','${sic.ts}','${JSON.stringify(sic)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelSICs(sics) {
    if (Array.isArray(sics) && sics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sics.forEach(sic => {
        let sqlStr = `delete from sceneitemclass where id=${sic.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from sceneitemclass_recent where id=${sic.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改
function bulkUpdateSICs(sics) {
    if (Array.isArray(sics) && sics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sics.forEach(sic => {
        let sqlStr = `update sceneitemclass set name='${sic.name}',ts='${sic.ts}',value='${JSON.stringify(sic)}' where id=${sic.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update sceneitemclass_recent set name='${sic.name}',ts='${sic.ts}',value='${JSON.stringify(sic)}' where id=${sic.id}`;
        executeSQL(sqlStrRec);
    });
}

//增加最近
export function addSICRecent(sic) {    
    let sqlStr = `insert or ignore into sceneitemclass_recent(id,name,ts,value) values(${sic.id},'${sic.name}','${sic.ts}','${JSON.stringify(sic)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delSICRecent(sic) {
    let sqlStr = `delete from sceneitemclass_recent where id=${sic.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getSICRecent() {
    let sqlStr = `select value from sceneitemclass_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
