import { reqGetEITList, reqGetEITCache } from "../../api/exectiveTemplate";
import { queryDataTs, updateDataTs, addDataTs, executeSQL, getDocByID } from "../db";
import { GetDataTypeDefaultValue } from "../dataTypes";

const dataName = "exectivetemplate";

export async function initEITCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts
        const res = await reqGetEITList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddEITs(res.data);
        }
        
    } else {//存在ts
        const cacheRes = await reqGetEITCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelEITs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddEITs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateEITs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        } 
    }
}
//批量增加
function bulkAddEITs(eits) {
    if (Array.isArray(eits) && eits.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    //数据转换
    transEITsToFrontend(eits);

    eits.forEach(eit => {
        let sqlStr = `insert into exectivetemplate(id,code,name,ts,value) values(${eit.id},'${eit.code}','${eit.name}','${eit.ts}','${JSON.stringify(eit)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelEITs(eits) {
    if (Array.isArray(eits) && eits.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    eits.forEach(eit => {
        let sqlStr = `delete from exectivetemplate where id=${eit.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from exectivetemplate_recent where id=${eit.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改
function bulkUpdateEITs(eits) {
    if (Array.isArray(eits) && eits.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    //数据转换
    transEITsToFrontend(eits);
    eits.forEach(eit => {
        let sqlStr = `update exectivetemplate set code='${eit.code}',name='${eit.name}',ts='${eit.ts}',value='${JSON.stringify(eit)}' where id=${eit.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update exectivetemplate_recent set code='${eit.code}',name='${eit.name}',ts='${eit.ts}',value='${JSON.stringify(eit)}' where id=${eit.id}`;
        executeSQL(sqlStrRec);
    });
}
//执行模板批量后端转前端
const transEITsToFrontend = (eits) => {   
    for (let eit of eits) {
        for (let row of eit.body) {
            switch (row.eid.resulttype.id) {
                case 301:
                case 306:
                case 307:
                    break;
                case 302:
                    row.defaultvalue = parseFloat(row.defaultvalue);
                    row.errorvalue = parseFloat(row.errorvalue);
                    row.eid.defaultvalue = parseFloat(row.eid.defaultvalue);
                    row.eid.errorvalue = parseFloat(row.eid.errorvalue);
                    break;
                case 401:
                case 404:
                    row.defaultvalue = parseInt(row.defaultvalue);
                    row.errorvalue = parseInt(row.errorvalue);
                    row.eid.defaultvalue = parseInt(row.eid.defaultvalue);
                    row.eid.errorvalue = parseInt(row.eid.errorvalue);
                    break;
                case 510:
                case 520:
                case 525:
                case 530:
                case 540:
                case 550:
                    row.defaultvalue = row.defaultvalue !== "0" ? getDocByID(row.eid.resulttype.frontdb, parseInt(row.defaultvalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                    row.errorvalue = row.errorvalue !== "0" ? getDocByID(row.eid.resulttype.frontdb, parseInt(row.errorvalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                    row.eid.defaultvalue = row.eid.defaultvalue !== "0" ? getDocByID(row.eid.resulttype.frontdb, parseInt(row.eid.defaultvalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                    row.eid.errorvalue = row.eid.errorvalue !== "0" ? getDocByID(row.eid.resulttype.frontdb, parseInt(row.eid.errorvalue)) : GetDataTypeDefaultValue(row.eid.resulttype.id);
                    break;
                default:
                    console.error("No matching DataType");
            }
        }
    }
};

//增加最近
export function addEITRecent(eit) {
    let sqlStr = `insert or ignore into exectivetemplate_recent(id,code,name,ts,value) values(${eit.id},'${eit.code}','${eit.name}','${eit.ts}','${JSON.stringify(eit)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delEITRecent(eit) {
    let sqlStr = `delete from exectivetemplate_recent where id=${eit.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getEITRecent() {
    let sqlStr = `select value from exectivetemplate_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}
