import { executeSQL } from "../db";
//暂存指令单
export function saveLocalWO(wo) {
    let sqlStr = `insert into workorderdoc(createuserid,value) 
        values(${wo.createuser.id},'${JSON.stringify(wo)}')`;
    executeSQL(sqlStr);
}

//获取当前用户本地暂存
export function getLocalWOs(createuseid) {
    let sqlStr = `select id,value from workorderdoc where createuserid=${createuseid}`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            let wo = JSON.parse(doc.value);
            wo.id = doc.id
            docs.push(wo);
        })
    }
    return docs;
}

//获取本地所有暂存单据
export function getAllLocalWOs() {
    let sqlStr = `select id,value from workorderdoc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            let wo = JSON.parse(doc.value);
            wo.id = doc.id
            docs.push(wo);
        })
    }
    return docs;
}
//删除本地暂存
export function delLocalWO(wo) {
    let sqlStr = `delete from workorderdoc where id=${wo.id}`;
    executeSQL(sqlStr);
}
//删除所有本地暂存
export function delLocalAllWO() {
    let sqlStr = `delete from workorderdoc`;
    executeSQL(sqlStr);
}

//编辑本地暂存
export function editLocalWO(wo) {
    let sqlStr = `update workorderdoc set value='${JSON.stringify(wo)}' where id=${wo.id}`;
    executeSQL(sqlStr);
}