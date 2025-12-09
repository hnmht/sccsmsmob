import { reqGetSimpEICList,reqGetSimpEICCache } from "../../api/exectiveItemClass";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "exectiveitemclass";

export async function initEICCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);
    if (ts === "") {//没有ts
        const res = await reqGetSimpEICList(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddEics(res.data.data);
        } 
        
    } else {//存在ts
        const cacheRes = await reqGetSimpEICCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelEics(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddEics(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateEics(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除执行项目类别
function bulkDelEics(eics) {
    if (Array.isArray(eics) && eics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    eics.forEach(eic => {
        let sqlStr = `delete from exectiveitemclass where id=${eic.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from exectiveitemclass_recent where id=${eic.id}`;
        executeQuery(sqlStrRec);
    });
}
//批量修改执行项目类别
function bulkUpdateEics(eics) {
    if (Array.isArray(eics) && eics.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    eics.forEach(eic => {
        let sqlStr = `update exectiveitemclass set name='${eic.name}',ts='${eic.ts}',value='${JSON.stringify(eic)}' where id=${eic.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `update exectiveitemclass_recent set name='${eic.name}',ts='${eic.ts}',value='${JSON.stringify(eic)}' where id=${eic.id}`;
        executeQuery(sqlStrRec);
    });
}

//增加最近
export function addEICRecent(eic) {
    let sqlStr = `insert or ignore into exectiveitemclass_recent(id,name,ts,value) values(${eic.id},'${eic.name}','${eic.ts}','${JSON.stringify(eic)}')`;
    executeQuery(sqlStr);
}
//删除最近
export function delEICRecent(eic) {
    let sqlStr = `delete from exectiveitemclass_recent where id=${eic.id}`;
    executeQuery(sqlStr);
}

//获取最近
export function getEICRecent() {
    let sqlStr = `select value from exectiveitemclass_recent order by autoid desc`;
    let { rows } = executeQuery(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}



