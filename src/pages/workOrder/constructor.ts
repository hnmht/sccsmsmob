import { getEmptyPerson } from "../../dataType/dataZero/person";
import { getEmptyWorkOrder } from "../../dataType/dataZero/workOrder";
import { SimpDept } from "../../dataType/types/department";
import { Person } from "../../dataType/types/person";
import { ErrMsg } from "../../dataType/types/scInput";
import { WOErrors, WorkOrder, WorkOrderRow, WORowErrors } from "../../dataType/types/workOrder";
import { EPTRepo } from "../../db/crud/ept";
import { dayjs, EpochTime } from "../../i18n/dayjs";
import { cloneDeep } from "lodash";

// Generate Work Order data
export const getInitialValue = async (oriWO: WorkOrder | undefined, isNew: boolean, isModify: boolean, person: Person, dept: SimpDept) => {
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
            newWO.body.map((row: WorkOrderRow) => {
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
            return newWO;
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



// Check WorkOrder Data errors
export const checkWOErrors = (woData: WorkOrder | undefined): WOErrors => {
    const noErr: ErrMsg = { isErr: false, msg: "" };
    const errData: WOErrors = {
        billDate: noErr,
        workDate: noErr,
        body: [],
        isErr: false,
        isBodyErr: false,
        isHeaderErr: false,
    };

    if (woData === undefined) {
        return errData;
    }
    let headerErrNumber = 0;
    let bodyErrorNumber = 0;
    //检查表头单据日期
    if (woData.billDate === "") {
        errData.billDate = { isErr: true, msg: "单据日期不能为空" };
        headerErrNumber++
    }
    //检查表头作业日期
    if (woData.workDate === "") {
        errData.workDate = { isErr: true, msg: "作业日期不能为空" }
        headerErrNumber++
    }
    //检查表体
    woData.body.forEach((row, index) => {
        let rowErr: WORowErrors = {
            csa: noErr,
            executor: noErr,
            ept: noErr,
            startTime: noErr,
            endTime: noErr
        };
        if (row.csa.id === 0) {
            rowErr.csa = { isErr: true, msg: "现场档案不能为空" };
            bodyErrorNumber++
        }
        if (row.executor.id === 0) {
            rowErr.executor = { isErr: true, msg: "执行人不能为空" };
            bodyErrorNumber++
        }
        if (row.ept.id === 0) {
            rowErr.ept = { isErr: true, msg: "执行模板不能为空" };
            bodyErrorNumber++
        }
        if (row.startTime === "") {
            rowErr.startTime = { isErr: true, msg: "开始时间必须填写" };
            bodyErrorNumber++
        }
        if (row.endTime === "") {
            rowErr.endTime = { isErr: true, msg: "结束时间必须填写" };
            bodyErrorNumber++
        } else {
            if (row.endTime < row.startTime) {
                rowErr.endTime = { isErr: true, msg: "结束时间必须大于开始时间" };
                bodyErrorNumber++
            }
        }
        errData.body.push(rowErr);
    });
    errData.isErr = (bodyErrorNumber > 0 || headerErrNumber > 0);
    errData.isBodyErr = bodyErrorNumber > 0;
    errData.isHeaderErr = headerErrNumber > 0;
    return errData;
};

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

