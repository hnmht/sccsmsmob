import { reqGetSimpSICList, reqGetSimpSICCache } from "../../api/sceneItemClass";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "sceneitemclass";

export async function initSICCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);
    if (ts === "") {//没有ts
        const res = await reqGetSimpSICList(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddSICs(res.data.data);
        } 
        
    } else {//存在ts
        const cacheRes = await reqGetSimpSICCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelSICs(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddSICs(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateSICs(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelSICs(sics) {
    if (Array.isArray(sics) && sics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sics.forEach(sic => {
        let sqlStr = `delete from sceneitemclass where id=${sic.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from sceneitemclass_recent where id=${sic.id}`;
        executeQuery(sqlStrRec);
    });
}
//批量修改
function bulkUpdateSICs(sics) {
    if (Array.isArray(sics) && sics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sics.forEach(sic => {
        let sqlStr = `update sceneitemclass set name='${sic.name}',ts='${sic.ts}',value='${JSON.stringify(sic)}' where id=${sic.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `update sceneitemclass_recent set name='${sic.name}',ts='${sic.ts}',value='${JSON.stringify(sic)}' where id=${sic.id}`;
        executeQuery(sqlStrRec);
    });
}

//增加最近
export function addSICRecent(sic) {    
    let sqlStr = `insert or ignore into sceneitemclass_recent(id,name,ts,value) values(${sic.id},'${sic.name}','${sic.ts}','${JSON.stringify(sic)}')`;
    executeQuery(sqlStr);
}
//删除最近
export function delSICRecent(sic) {
    let sqlStr = `delete from sceneitemclass_recent where id=${sic.id}`;
    executeQuery(sqlStr);
}

//获取最近
export function getSICRecent() {
    let sqlStr = `select value from sceneitemclass_recent order by autoid desc`;
    let { rows } = executeQuery(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
