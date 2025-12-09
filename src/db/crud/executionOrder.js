import { executeQuery } from "../DB";
//暂存
export function saveLocalED(ed) {
    let sqlStr = `insert into executedoc(createuserid,value) 
        values(${ed.createuser.id},'${JSON.stringify(ed)}')`;
    executeQuery(sqlStr);
}

//获取当前用户本地暂存
export function getLocalEDs(createuseid) {
    let sqlStr = `select id,value from executedoc where createuserid=${createuseid}`;
    let { rows } = executeQuery(sqlStr);
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
export function getAllLocalEDs() {
    let sqlStr = `select id,value from executedoc`;
    let { rows } = executeQuery(sqlStr);
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
export function delLocalED(ed) {
    let sqlStr = `delete from executedoc where id=${ed.id}`;
    executeQuery(sqlStr);
}
//删除所有本地暂存
export function delLocalAllED(ed) {
    let sqlStr = `delete from executedoc`;
    executeQuery(sqlStr);
}

//编辑本地暂存
export function editLocalED(ed) {
    let sqlStr = `update executedoc set value='${JSON.stringify(ed)}' where id=${ed.id}`;
    executeQuery(sqlStr);
}