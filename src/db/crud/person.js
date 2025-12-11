import { reqGetPersons, reqGetPersonsCache } from "../../api/person";
import { queryDataTs, updateDataTs, addDataTs, executeSQL } from "../db";

const dataName = "person";

export async function initPersonCache() {
    //获取最新档案ts
    let ts = queryDataTs(dataName);
    if (ts === "") {//没有ts
        const res = await reqGetPersons(false);
        if (res.status) {
            const latestTs = res.data[0].ts;
            //存储最新ts
            addDataTs(dataName, latestTs);
            //批量增加档案
            bulkAddPersons(res.data);
        }

    } else {//存在ts
        const cacheRes = await reqGetPersonsCache({ queryTs: ts }, false);
        if (cacheRes.status) {
            const docCache = cacheRes.data;
            if (docCache.resultNumber > 0) {
                //存在待删除档案
                if (docCache.delItems !== null) {
                    bulkDelPersons(docCache.delItems);
                }
                //存在新增档案
                if (docCache.newItems !== null) {
                    bulkAddPersons(docCache.newItems);
                }
                //存在待更新档案
                if (docCache.updateItems !== null) {
                    bulkUpdatePersons(docCache.updateItems);
                }
            }
            //更新最新ts
            updateDataTs(dataName, docCache.resultTs);
        }

    }
}
//批量增加
function bulkAddPersons(persons) {
    if (Array.isArray(persons) && persons.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    persons.forEach(person => {
        let sqlStr = `insert into person(id,code,name,dept_id,op_id,ts,value) 
        values(${person.id},'${person.code}','${person.name}',${person.deptid},${person.op_id},
        '${person.ts}','${JSON.stringify(person)}')`;
        executeSQL(sqlStr);
    });
};
//批量删除
function bulkDelPersons(persons) {
    if (Array.isArray(persons) && persons.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    persons.forEach(person => {
        let sqlStr = `delete from person where id=${person.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `delete from person_recent where id=${person.id}`;
        executeSQL(sqlStrRec);
    });
}
//批量修改
function bulkUpdatePersons(persons) {
    if (Array.isArray(persons) && persons.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    persons.forEach(person => {
        let sqlStr = `update person set code='${person.code}',name='${person.name}',dept_id=${person.deptid},op_id=${person.op_id},ts='${person.ts}',
        value='${JSON.stringify(person)}' 
        where id=${person.id}`;
        executeSQL(sqlStr);
        let sqlStrRec = `update person_recent set code='${person.code}',name='${person.name}',dept_id=${person.deptid},op_id=${person.op_id},ts='${person.ts}',value='${JSON.stringify(person)}' where id=${person.id}`;
        executeSQL(sqlStrRec);
    });
}

//根据部门ids获取部门档案
export function getPersonByDeptIDs(deptIDs) {
    let sqlString = `select value from person where dept_id in (${deptIDs.toString()})`;

    let { rows } = executeSQL(sqlString);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}

//增加最近使用人员
export function addPersonRecent(person) {
    let sqlStr = `insert or ignore into person_recent(id,code,name,dept_id,op_id,ts,value) 
     values(${person.id},'${person.code}','${person.name}',${person.deptid},${person.op_id},'${person.ts}','${JSON.stringify(person)}')
     `;
    executeSQL(sqlStr);
}
//删除最近使用人员
export function delPersonRecent(person) {
    let sqlStr = `delete from person_recent where id=${person.id}`;
    executeSQL(sqlStr);
}

//获取最近使用人员
export function getPersonRecent() {
    let sqlStr = `select value from person_recent order by autoid desc`;
    let { rows } = executeSQL(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}



