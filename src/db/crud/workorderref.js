import { executeSQL } from "../db";
const dataName = "workorderref";

//批量增加
export function bulkSaveWorefs(refs) {
    let delStr = `delete from ${dataName}`;
    executeSQL(delStr);
    //删除原有数据
    if (Array.isArray(refs) && refs.length === 0) {
        return
    }
    refs.forEach(ref => {
        let sqlStr = `insert into ${dataName}(id,hid,billdate,billnumber,status,ts,value) 
        values(${ref.id},${ref.hid},'${ref.billdate}','${ref.billnumber}',${ref.status},'${ref.ts}','${JSON.stringify(ref)}')`;
        executeSQL(sqlStr);
    });
}
//修改状态
export function updateWorefStatus(id, status) {
    let sqlStr = `update ${dataName} set status=${status} where id=${id}`;
    executeSQL(sqlStr);
}

//获取档案
export function getLocalWOR() {
    let sqlStr = `select json(value) as value from ${dataName} where status=1`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}