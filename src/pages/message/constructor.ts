// import dayjs from "dayjs";
import dayjs from "../../utils/myDayjs";

//生成查询字段
export const generateMSGQueryFields = () => {
    const edQueryFields = [
        { id: 1, value: "c.sendtime", label: "发送时间", inputType: 307, resultType: "string", resultfield: "" },
        { id: 2, value: "c.billnumber", label: "执行单号", inputType: 301, resultType: "string", resultfield: "" },
        { id: 3, value: "c.createuserid", label: "发送人", inputType: 510, resultType: "object", resultfield: "id" },
        { id: 4, value: "h.si_id", label: "现场", inputType: 570, resultType: "object", resultfield: "id" },
        { id: 5, value: "b.eid_id", label: "执行项目", inputType: 560, resultType: "object", resultfield: "id" },
        { id: 6, value: "c.content", label: "内容", inputType: 301, resultType: "string", resultfield: "" }
    ];
    return edQueryFields;
};

//生成默认查询条件
export function generateMsgDefaultCons() {
    let conditions = [
        {
            logic: "and",
            field: { id: 1, value: "c.sendtime", label: "发送时间", inputType: 307, resultType: "string", resultfield: "" },
            compare: { id: "greaterthanequal", label: '大于等于', value: '>=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: `${dayjs().weekday(0).format("YYYYMMDD")}0000`,
            isNecessary: true
        },
        {
            logic: "and",
            field: { id: 1, value: "c.sendtime", label: "发送时间", inputType: 307, resultType: "string", resultfield: "" },
            compare: { id: "lessthanequal", label: '小于等于', value: '<=', addCharacter: false, needInput: true, applicable: ["object", "string", "int", "number"] },
            value: `${dayjs(new Date()).format("YYYYMMDD")}2359`,
            isNecessary: true
        }
    ];
    return conditions;
}