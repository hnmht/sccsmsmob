import { reqGetEIDList, reqGetEIDCache } from "../../api/exectiveItem";
import { queryDataTs, updateDataTs, addDataTs, executeSQL, getDocByID } from "../db";
import { GetDataTypeDefaultValue } from "../dataTypes";

const dataName = "exectiveitem";

export async function initEIDCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts
        const res = await reqGetEIDList(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //批量增加档案
            bulkAddEIDs(res.data);
            //存储最新ts
            addDataTs(dataName, latestTs);
        } 
    } else {//存在ts
        const cacheRes = await reqGetEIDCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelEIDs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddEIDs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    // console.log("存在待更新档案", docCache.updateItems);
                    bulkUpdateEIDs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        } 
    }
}
//批量增加
function bulkAddEIDs(eids) {
    if (Array.isArray(eids) && eids.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    //数据转换
    transEIDsToFrontend(eids);

    eids.forEach(eid => {
        let sqlStr = `insert into exectiveitem(id,code,name,itemclass_id,resulttype_id,value) values(${eid.id},'${eid.code}','${eid.name}',${eid.itemclass.id},${eid.resulttype.id},'${JSON.stringify(eid)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelEIDs(eids) {
    if (Array.isArray(eids) && eids.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    eids.forEach(eid => {
        let sqlStr = `delete from exectiveitem where id=${eid.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from exectiveitem_recent where id=${eid.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改
function bulkUpdateEIDs(eids) {
    if (Array.isArray(eids) && eids.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    //数据转换
    transEIDsToFrontend(eids);
    eids.forEach(eid => {   
        let sqlStr = `update exectiveitem set code='${eid.code}',name='${eid.name}',itemclass_id=${eid.itemclass.id},resulttype_id=${eid.resulttype.id},value='${JSON.stringify(eid)}' where id=${eid.id}`;       
        executeSQL(sqlStr);
        let sqlStrRec = `update exectiveitem_recent set code='${eid.code}',name='${eid.name}',itemclass_id=${eid.itemclass.id},resulttype_id=${eid.resulttype.id},value='${JSON.stringify(eid)}' where id=${eid.id}`;
        executeSQL(sqlStrRec);
    });
}


//执行项目档案后端批量转前端
const transEIDsToFrontend = (eids) => {
    for (let newEid of eids) {
        switch (newEid.resulttype.id) {
            case 301:
            case 306:
            case 307:
                break;
            case 302:
                newEid.defaultvalue = parseFloat(newEid.defaultvalue);
                newEid.errorvalue = parseFloat(newEid.errorvalue);
                break;
            case 401:
            case 404:
                newEid.defaultvalue = parseInt(newEid.defaultvalue);
                newEid.errorvalue = parseInt(newEid.errorvalue);
                break;
            case 510:
            case 520:
            case 525:
            case 530:
            case 540:
            case 550:
                newEid.defaultvalue = newEid.defaultvalue !== "0" ? getDocByID(newEid.resulttype.frontdb, parseInt(newEid.defaultvalue)) : GetDataTypeDefaultValue(newEid.resulttype.id);
                newEid.errorvalue = newEid.errorvalue !== "0" ? getDocByID(newEid.resulttype.frontdb, parseInt(newEid.errorvalue)) : GetDataTypeDefaultValue(newEid.resulttype.id);
                break;
            default:
                console.error("No matching DataType");
        }
    }
};

//增加最近
export function addEIDRecent(eid) {
    let sqlStr = `insert or ignore into 
    exectiveitem_recent(id,code,name,itemclass_id,resulttype_id,value) 
    values(${eid.id},'${eid.code}','${eid.name}',${eid.itemclass.id},${eid.resulttype.id},'${JSON.stringify(eid)}')`;
    executeSQL(sqlStr);
}
//删除最近
export function delEIDRecent(eid) {
    let sqlStr = `delete from exectiveitem_recent where id=${eid.id}`;
    executeSQL(sqlStr);
}

//获取最近
export function getEIDRecent() {
    let sqlStr = `select value from exectiveitem_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}