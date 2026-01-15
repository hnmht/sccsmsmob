import { Comparison } from "../types/queryPanel";
import { ScDataTypeList } from "../types/scDataType";

export const allCompareType: ScDataTypeList[] = [
    ScDataTypeList.Text,
    ScDataTypeList.Number,
    ScDataTypeList.Password,
    ScDataTypeList.Mobile,
    ScDataTypeList.Email,
    ScDataTypeList.Date,
    ScDataTypeList.DateTime,
    ScDataTypeList.Gender,
    ScDataTypeList.SwitchYesOrNo,
    ScDataTypeList.CheckYesOrNo,
    ScDataTypeList.SelectYesOrNo,
    ScDataTypeList.Person,
    ScDataTypeList.SimpDept,
    ScDataTypeList.SimpCSC,
    ScDataTypeList.UserDefineCategory,
    ScDataTypeList.SimpEPC,
    ScDataTypeList.UserDefinedArchive,
    ScDataTypeList.ExecutionProject,
    ScDataTypeList.ConstructionSite,
    ScDataTypeList.EPT,
    ScDataTypeList.RiskLevel,
    ScDataTypeList.SimpDC,
    ScDataTypeList.Position,
    ScDataTypeList.TC,
    ScDataTypeList.PPE,
    ScDataTypeList.AvatarUpload,
    ScDataTypeList.FileUpload,
];

export const nullComparisonType: ScDataTypeList[] = [
    ScDataTypeList.Text,
    ScDataTypeList.Number,
    ScDataTypeList.Password,
    ScDataTypeList.Mobile,
    ScDataTypeList.Email,
    ScDataTypeList.Gender,
    ScDataTypeList.Person,
    ScDataTypeList.SimpDept,
    ScDataTypeList.SimpCSC,
    ScDataTypeList.UserDefineCategory,
    ScDataTypeList.SimpEPC,
    ScDataTypeList.UserDefinedArchive,
    ScDataTypeList.ExecutionProject,
    ScDataTypeList.ConstructionSite,
    ScDataTypeList.EPT,
    ScDataTypeList.RiskLevel,
    ScDataTypeList.SimpDC,
    ScDataTypeList.Position,
    ScDataTypeList.TC,
    ScDataTypeList.PPE,
    ScDataTypeList.AvatarUpload,
    ScDataTypeList.FileUpload,
];

export const Comparisons: Comparison[] = [
    {
        id: "equal",
        label: 'equal',
        value: '=',
        needInput: true,
        addCharacter: false,
        addStart: "",
        addEnd: "",
        applicable: allCompareType
    },
    {
        id: "notequal",
        label: 'notEqual',
        value: '!=',
        addCharacter: false,
        addStart: "",
        addEnd: "",
        needInput: true,
        applicable: allCompareType
    },
    {
        id: "lessthan",
        label: 'lessThan',
        value: '<',
        addCharacter: false,
        addStart: "",
        addEnd: "",
        needInput: true,
        applicable: allCompareType
    },
    {
        id: "greaterthan",
        label: 'greaterThan',
        value: '>',
        addCharacter: false,
        addStart: "",
        addEnd: "",
        needInput: true,
        applicable: allCompareType
    },
    {
        id: "lessthanequal",
        label: 'lessThanEqual',
        value: '<=',
        addCharacter: false,
        addStart: "",
        addEnd: "",
        needInput: true,
        applicable: allCompareType
    },
    {
        id: "greaterthanequal",
        label: 'greaterThanEqual',
        value: '>=',
        addCharacter: false,
        addStart: "",
        addEnd: "",
        needInput: true,
        applicable: allCompareType
    },
    {
        id: "contain",
        label: 'contain',
        value: 'ilike',
        addCharacter: true,
        addStart: "%",
        addEnd: "%",
        needInput: true,
        applicable: [ScDataTypeList.Text]
    },
    {
        id: "notcontain",
        label: 'notContain',
        value: 'not ilike',
        addCharacter: true,
        addStart: "%",
        addEnd: "%",
        needInput: true,
        applicable: [ScDataTypeList.Text]
    },
    {
        id: "null",
        label: 'null',
        value: 'is null',
        addCharacter: false,
        addStart: "",
        addEnd: "",
        needInput: false,
        applicable: nullComparisonType
    },
    {
        id: "notnull",
        label: 'notNull',
        value: 'is not null',
        addCharacter: false,
        addStart: "",
        addEnd: "",
        needInput: false,
        applicable: nullComparisonType
    }
];