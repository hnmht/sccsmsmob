import { reqGetPersons, reqGetPersonsCache } from "../../api/person";
import { Person, PersonCache } from "../../dataType/types/person";
import { MasterDataRepository } from "./masterDataRespository";
import { getEmptyPerson } from "../../dataType/dataZero/person";

// Person
export const personRepo = new MasterDataRepository <Person, PersonCache>({
    table: "person",
    recentTable: "person_recent",
    primaryKey: "id",
    primaryPath: "id",
    valueField: "value",
    fieldsMap: {
        "code":"code",
        "name": "name",
        "deptid":"deptID",
        "positionid":"positionID",
        "ts": "ts",
    },
    emptyFn:getEmptyPerson,
    convertToFront: (data: Person[]) => data,
    getFullData: reqGetPersons,
    getCacheData: reqGetPersonsCache,
    extractTs: d => d.ts!,
    extractId: d => d.id,
});



