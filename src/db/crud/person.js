import { reqGetPersons, reqGetPersonsCache } from "../../api/person";
import { queryDocTs, updateDocTs, addDocTs, executeQuery } from "../DB";

const docName = "person";

export async function initPersonCache() {
    //获取最新档案ts
    let ts = queryDocTs(docName);
    if (ts === "") {//没有ts
        const res = await reqGetPersons(false);
        if (res.data.status === 0) {
            const latestTs = res.data.data[0].ts;
            //存储最新ts
            addDocTs(docName, latestTs);
            //批量增加档案
            bulkAddPersons(res.data.data);
        }

    } else {//存在ts
        const cacheRes = await reqGetPersonsCache({ queryTs: ts }, false);
        if (cacheRes.data.status === 0) {
            const docCache = cacheRes.data.data;
            if (docCache.resultnum > 0) {
                //存在待删除档案
                if (docCache.delitems !== null) {
                    bulkDelPersons(docCache.delitems);
                }
                //存在新增档案
                if (docCache.newitems !== null) {
                    bulkAddPersons(docCache.newitems);
                }
                //存在待更新档案
                if (docCache.updateitems !== null) {
                    bulkUpdatePersons(docCache.updateitems);
                }
            }
            //更新最新ts
            updateDocTs(docName, docCache.resultts);
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
        executeQuery(sqlStr);
    });
};
//批量删除
function bulkDelPersons(persons) {
    if (Array.isArray(persons) && persons.length === 0) { //如果不是数组或者数组长度为0则直接退出
        return
    }
    persons.forEach(person => {
        let sqlStr = `delete from person where id=${person.id}`;
        executeQuery(sqlStr);
        let sqlStrRec = `delete from person_recent where id=${person.id}`;
        executeQuery(sqlStrRec);
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
        executeQuery(sqlStr);
        let sqlStrRec = `update person_recent set code='${person.code}',name='${person.name}',dept_id=${person.deptid},op_id=${person.op_id},ts='${person.ts}',value='${JSON.stringify(person)}' where id=${person.id}`;
        executeQuery(sqlStrRec);
    });
}

//根据部门ids获取部门档案
export function getPersonByDeptIDs(deptIDs) {
    let sqlString = `select value from person where dept_id in (${deptIDs.toString()})`;

    let { rows } = executeQuery(sqlString);
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
    executeQuery(sqlStr);
}
//删除最近使用人员
export function delPersonRecent(person) {
    let sqlStr = `delete from person_recent where id=${person.id}`;
    executeQuery(sqlStr);
}

//获取最近使用人员
export function getPersonRecent() {
    let sqlStr = `select value from person_recent order by autoid desc`;
    let { rows } = executeQuery(sqlStr);
    let docs = [];
    if (rows.length > 0) {
        rows._array.forEach(doc => {
            docs.push(JSON.parse(doc.value));
        })
    }
    return docs;
}



