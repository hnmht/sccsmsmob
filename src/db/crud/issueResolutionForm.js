import { executeSQL } from "../db";
const tableName = "disposedoc";
//暂存
export function saveLocalDD(dd) {
    let sqlStr = `insert into ${tableName}(createuserid,value) 
        values(${dd.createuser.id},'${JSON.stringify(dd)}')`;
    executeSQL(sqlStr);
}

//获取当前用户本地暂存
export function getLocalDDs(createuseid) {
    let sqlStr = `select id,value from ${tableName} where createuserid=${createuseid}`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            let dd = JSON.parse(doc.value);
            dd.id = doc.id
            docs.push(dd);
        })
    }
    return docs;
}
//获取所有本地暂存
export function getAllLocalDDs() {
    let sqlStr = `select id,value from ${tableName}`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            let dd = JSON.parse(doc.value);
            dd.id = doc.id
            docs.push(dd);
        })
    }
    return docs;
}

//删除本地暂存
export function delLocalDD(dd) {
    let sqlStr = `delete from ${tableName} where id=${dd.id}`;
    executeSQL(sqlStr);
}
//删除所有本地暂存
export function delLocalAllDD(dd) {
    let sqlStr = `delete from ${tableName}`;
    executeSQL(sqlStr);
}

//编辑本地暂存
export function editLocalDD(dd) {
    let sqlStr = `update ${tableName} set value='${JSON.stringify(dd)}' where id=${dd.id}`;
    executeSQL(sqlStr);
}