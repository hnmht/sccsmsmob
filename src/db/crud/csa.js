import { reqGetSIList, reqGetSICache } from "../../api/sceneItem";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "sceneitem";

export async function initSICache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);

    if (ts === "") {//没有ts
        const res = await reqGetSIList(false);        
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddSIs(res.data.data);
        } 
        
    } else {//存在ts
        const cacheRes = await reqGetSICache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelSIs(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddSIs(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateSIs(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
        }
    }
}
//批量增加
function bulkAddSIs(sis) {
    if (Array.isArray(sis) && sis.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sis.forEach(si => {
        let sqlStr = `insert into sceneitem(id,code,name,itemclass_id,ts,value) values(${si.id},'${si.code}','${si.name}',${si.itemclass.id},'${si.ts}','${JSON.stringify(si)}')`;
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelSIs(sis) {
    if (Array.isArray(sis) && sis.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sis.forEach(si => {
        let sqlStr = `delete from sceneitem where id=${si.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from sceneitem_recent where id=${si.id}`;
        executeQuery(sqlStrRec);
    });
}
//批量修改
function bulkUpdateSIs(sis) {
    if (Array.isArray(sis) && sis.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sis.forEach(si => {
        let sqlStr = `update sceneitem set code='${si.code}',name='${si.name}',itemclass_id=${si.itemclass.id},ts='${si.ts}',value='${JSON.stringify(si)}' where id=${si.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `update sceneitem_recent set code='${si.code}',name='${si.name}',itemclass_id=${si.itemclass.id},ts='${si.ts}',value='${JSON.stringify(si)}' where id=${si.id}`;
        executeQuery(sqlStrRec);
    });
}

//增加最近
export function addSIRecent(si) {
    let sqlStr = `insert or ignore into 
     sceneitem_recent(id,code,name,itemclass_id,ts,value) 
     values(${si.id},'${si.code}','${si.name}',${si.itemclass.id},'${si.ts}','${JSON.stringify(si)}')`;
    executeQuery(sqlStr);
}
//删除最近
export function delSIRecent(si) {
    let sqlStr = `delete from sceneitem_recent where id=${si.id}`;
    executeQuery(sqlStr);
}

//获取最近
export function getSIRecent() {
    let sqlStr = `select value from sceneitem_recent order by autoid desc`;
    let { rows } = executeQuery(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
