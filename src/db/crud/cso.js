import { reqSIOs,reqGetSIOCache } from "../../api/sceneItem";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "sceneitemoption";

export async function initSIOCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);  
    if (ts === "") {//没有ts
        const res = await reqSIOs(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddSIOs(res.data.data);
        } 
    } else {//存在ts
        const cacheRes = await reqGetSIOCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelSIOs(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddSIOs(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdateSIOs(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelSIOs(sios) {
    if (Array.isArray(sios) && sios.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sios.forEach(sio => {
        let sqlStr = `delete from sceneitemoption where id=${sio.id}`;
        executeQuery(sqlStr);
    });
}
//批量修改
function bulkUpdateSIOs(sios) {
    if (Array.isArray(sios) && sios.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    sios.forEach(sio => {
        let sqlStr = `update sceneitemoption set code='${sio.code}',name='${sio.name}',ts='${sio.ts}',value='${JSON.stringify(sio)}' where id=${sio.id}`;
        executeQuery(sqlStr);
    });
}
