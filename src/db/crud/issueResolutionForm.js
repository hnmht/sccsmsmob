import { executeQuery } from "../DB";
const tableName = "disposedoc";
//暂存
export function saveLocalDD(dd) {
    let sqlStr = `insert into ${tableName}(createuserid,value) 
        values(${dd.createuser.id},'${JSON.stringify(dd)}')`;
    executeQuery(sqlStr);
}

//获取当前用户本地暂存
export function getLocalDDs(createuseid) {
    let sqlStr = `select id,value from ${tableName} where createuserid=${createuseid}`;
    let { rows } = executeQuery(sqlStr);
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
    let { rows } = executeQuery(sqlStr);
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
    executeQuery(sqlStr);
}
//删除所有本地暂存
export function delLocalAllDD(dd) {
    let sqlStr = `delete from ${tableName}`;
    executeQuery(sqlStr);
}

//编辑本地暂存
export function editLocalDD(dd) {
    let sqlStr = `update ${tableName} set value='${JSON.stringify(dd)}' where id=${dd.id}`;
    executeQuery(sqlStr);
}