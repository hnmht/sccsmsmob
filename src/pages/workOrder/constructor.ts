
import { getEmptyPerson } from "../../dataType/dataZero/person";
import { getEmptyWorkOrder } from "../../dataType/dataZero/workOrder";
import { SimpDept } from "../../dataType/types/department";
import { Person } from "../../dataType/types/person";
import { WorkOrder } from "../../dataType/types/workOrder";
import { EPTRepo } from "../../db/crud/ept";
import { dayjs, EpochTime } from "../../i18n/dayjs";
import { cloneDeep } from "lodash";

// Generate Work Order data
export const getInitialValue = async (oriWO: WorkOrder, isNew: boolean, isModify: boolean, person: Person, dept: SimpDept) => {
    let newWO = getEmptyWorkOrder(person, dept);
    const currentDay = dayjs(new Date()).toISOString();
    const emptyPerson = getEmptyPerson();
    if (isNew) { //是否新增单据
        if (oriWO) {//复制新增            
            newWO = cloneDeep(oriWO);
            newWO.id = 0;
            newWO.billNumber = "";
            newWO.billDate = currentDay;
            newWO.status = 0;
            newWO.workDate = currentDay;
            newWO.body.map((row) => {
                row.id = 0;
                row.hid = 0;
                row.status = 0;
                return row;
            });
            newWO.creator = person;
            newWO.createDate = currentDay;
            newWO.modifier = emptyPerson;
            newWO.modifyDate = EpochTime;
            newWO.confirmer = emptyPerson;
            newWO.confirmDate = EpochTime;
        }
    } else { //编辑或者查看
        if (!oriWO) {
            return
        } else {
            if (isModify) { //编辑                
                newWO = cloneDeep(oriWO);
                newWO.createDate = currentDay;
                newWO.modifier = person;
                newWO.modifyDate = EpochTime;
                newWO.confirmer = emptyPerson;
                newWO.confirmDate = EpochTime;
            } else { //查看
                newWO = cloneDeep(oriWO);
                newWO.createDate = currentDay;
                newWO.modifyDate = EpochTime;
                newWO.confirmDate = EpochTime;
            }
        }
    }
    return newWO;
};



/* //检查错误
export const checkWOErrors = (woData: WorkOrder) => {
    if (woData === undefined) {
        return undefined;
    }
    const noErr = { isErr: false, msg: "" };
    let errData = {
        billDate: noErr,
        workDate: noErr,
        body: []
    };

    //检查表头单据日期
    if (woData.billDate === "") {
        errData.billDate = { isErr: true, msg: "单据日期不能为空" };
    }
    //检查表头作业日期
    if (woData.workDate === "") {
        errData.workDate = { isErr: true, msg: "作业日期不能为空" }
    }
    //检查表体
    woData.body.forEach((row, index) => {
        let rowErr = {
            csa: noErr,
            execperson: noErr,
            eit: noErr,
            starttime: noErr,
            endtime: noErr
        };
        if (row.csa.id === 0) {
            rowErr.csa = { isErr: true, msg: "现场档案不能为空" };
        }
        if (row.executor.id === 0) {
            rowErr.executor = { isErr: true, msg: "执行人不能为空" };
        }
        if (row.eit.id === 0) {
            rowErr.eit = { isErr: true, msg: "执行模板不能为空" };
        }
        if (row.starttime === "") {
            rowErr.starttime = { isErr: true, msg: "开始时间必须填写" };
        }
        if (row.endtime === "") {
            rowErr.endtime = { isErr: true, msg: "结束时间必须填写" };
        } else {
            if (row.endtime < row.starttime) {
                rowErr.endtime = { isErr: true, msg: "结束时间必须大于开始时间" };
            }
        }
        errData.body.push(rowErr);
    });
    return errData;
}; */

// Convert Work order to backend
export function transWOToBackend(newWo: WorkOrder) {
    newWo.body.map((row) => {
        row.ept.body = [];
        return row;
    })
    return newWo;
}


// Convert Work Order to frontend
export const transWoDetailToFronted = (woDetail: WorkOrder) => {
    function transBodyEpt() {
        for (let row of woDetail.body) {
            let eptID = row.ept.id
            row.ept = EPTRepo.getDetailByID(eptID);
        }
    }
    transBodyEpt();
    return woDetail;
};

