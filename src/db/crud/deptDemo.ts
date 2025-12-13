import { LocalRepository } from "./respository";
import { reqGetSimpDepts, reqGetSimpDeptsCache } from "../../api/department";
import { SimpDept, SimpDeptCache } from "../../dataType/types/department";
import { ConstructionSite, ConstructionSiteCache } from "../../dataType/types/csa";
import { reqGetCSList, reqGetCSCache } from "../../api/csa";



export const simpCSRepo = new LocalRepository<ConstructionSite, ConstructionSiteCache>({
    table: "csa",
    recentTable: "csa_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "cscid": "csc.id",
        "status": "status",
        "ts": "ts",
    },
    getFullData: reqGetCSList,
    getCacheData: reqGetCSCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});



export const deptRepo = new LocalRepository<SimpDept, SimpDeptCache>({
    table: "department",
    recentTable: "department_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code": "code",
        "name": "name",
        "ts": "ts",
    },
    getFullData: reqGetSimpDepts,
    getCacheData: reqGetSimpDeptsCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});


export function testSimpDept() {
    const dept1: SimpDept = {
        "id": 1,
        "code": "GMO",
        "name": "General Manager‘s Office",
        "fatherID": 0,
        "leader": {
            "id": 0,
            "code": "",
            "name": "",
            "avatar": {
                "id": 0,
                "hash": "",
                "minioFileName": "",
                "originFileName": "",
                "fileKey": 0,
                "filePath": "",
                "fileUri": "",
                "mime": "",
                "fileType": "",
                "isImage": 0,
                "model": "",
                "longitude": 0,
                "latitude": 0,
                "size": 0,
                "fileUrl": "",
                "dateTimeOriginal": "",
                "uploadTime": "0001-01-01T00:00:00Z",
                "source": "",
                "creatorID": 0,
                "creatorName": "",
                "dr": 0,
                "ts": "0001-01-01T00:00:00Z"
            },
            "deptID": 0,
            "deptCode": "",
            "deptName": "",
            "isOperator": 0,
            "positionID": 0,
            "positionName": "",
            "description": "",
            "mobile": "",
            "email": "",
            "gender": 0,
            "systemFlag": 0,
            "status": 0,
            "createDate": "0001-01-01T00:00:00Z",
            "ts": "0001-01-01T00:00:00Z",
            "dr": 0
        },
        "description": "",
        "status": 0,
        "createDate": "2025-11-24T09:23:34.241588+08:00",
        "ts": "2025-12-11T15:23:52.863928+08:00",
        "dr": 0
    }
    const depts: SimpDept[] = [];
    depts.push(dept1);

    // console.log("开始执行testSimpDept.bulkAdd")
    // deptRepo.bulkAdd(depts);
    //  console.log("开始执行testSimpDept.bulkUpdate")
    // deptRepo.bulkUpdate(depts);
    console.log("开始执行testSimpDept.addRecent")
    deptRepo.addRecent(dept1);

    const ts = deptRepo.getLatestTs();
    console.log("ts:", ts)
}

