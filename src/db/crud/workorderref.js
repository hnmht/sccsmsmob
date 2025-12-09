import { executeQuery } from "../DB";
const docName = "workorderref";

//批量增加
export function bulkSaveWorefs(refs) {
    let delStr = `delete from ${docName}`;
    executeQuery(delStr);
    //删除原有数据
    if (Array.isArray(refs) && refs.length === 0) {
        return
    }
    refs.forEach(ref => {
        let sqlStr = `insert into ${docName}(id,hid,billdate,billnumber,status,ts,value) 
        values(${ref.id},${ref.hid},'${ref.billdate}','${ref.billnumber}',${ref.status},'${ref.ts}','${JSON.stringify(ref)}')`;
        executeQuery(sqlStr);
    });
}
//修改状态
export function updateWorefStatus(id, status) {
    let sqlStr = `update ${docName} set status=${status} where id=${id}`;
    executeQuery(sqlStr);
}

//获取档案
export function getLocalWOR() {
    let sqlStr = `select json(value) as value from ${docName} where status=1`;
    let { rows } = executeQuery(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}