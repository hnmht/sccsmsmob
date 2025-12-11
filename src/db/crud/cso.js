import { reqSIOs,reqGetSIOCache } from "../../api/sceneItem";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "sceneitemoption";

export async function initSIOCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);  
    if (ts === "") {//没有ts
        const res = await reqSIOs(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddSIOs(res.data);
        } 
    } else {//存在ts
        const cacheRes = await reqGetSIOCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelSIOs(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddSIOs(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdateSIOs(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        } 
    }
}
//批量增加
function bulkAddSIOs(sios) {
    if (Array.isArray(sios) && sios.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sios.forEach(sio => {
        let sqlStr = `insert into sceneitemoption(id,code,name,ts,value) values(${sio.id},'${sio.code}','${sio.name}','${sio.ts}','${JSON.stringify(sio)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelSIOs(sios) {
    if (Array.isArray(sios) && sios.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sios.forEach(sio => {
        let sqlStr = `delete from sceneitemoption where id=${sio.id}`;
        executeSQL(sqlStr);
    });
}
//批量修改
function bulkUpdateSIOs(sios) {
    if (Array.isArray(sios) && sios.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sios.forEach(sio => {
        let sqlStr = `update sceneitemoption set code='${sio.code}',name='${sio.name}',ts='${sio.ts}',value='${JSON.stringify(sio)}' where id=${sio.id}`;
        executeSQL(sqlStr);
    });
}
