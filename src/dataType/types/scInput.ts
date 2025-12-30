import { ComponentType } from "react";
import { ConstructionSite } from "./csa";
import { SimpCSC } from "./csc";
import { SimpDC } from "./dc";
import { SimpDept } from "./department";
import { ExecutionProject } from "./epa";
import { SimpEPC } from "./epc";
import { EPT } from "./ept";
import { Person } from "./person";
import { Position } from "./postion";
import { PPE } from "./ppe";
import { RiskLevel } from "./riskLevel";
import { TC } from "./tc";
import { UserDefinedArchive } from "./uda";
import { UserDefineCategory } from "./udc";
import { File } from "./file";
import { VoucherFile } from "./voucherFile";

export interface MarkPosition {
    x: number;
    y: number;
}
export interface MarkText {
    position: MarkPosition;
    text: string;
    textSize: number;
    color: string;
}

export interface Location {
    latitude: number;
    longitude: number;
}

export enum ScDataTypeList {
    // Text = 301,
    // Number = 302,
    // Password = 303,
    // Mobile = 304,
    // Email = 305,
    // Date = 306,
    // DateTime = 307,

    // Gender = 401,
    // SwitchYesOrNo = 402,
    // CheckYesOrNo = 403,
    // SelectYesOrNo = 404,
    // VoucherStatus = 405,

    // Person = 510,
    // SimpDept = 520,
    // SimpCSC = 525,
    // UserDefineCategory = 530,
    // SimpEPC = 540,
    // UserDefinedArchive = 550,
    // ExecutionProject = 560,
    // ConstructionSite = 570,
    // EPT = 580,
    // RiskLevel = 590,
    // SimpDC = 600,
    // Position = 610,
    // TC = 620,
    // PPE = 630,

    AvatarUpload = 901,
    FileUpload = 902,
}

export interface ErrMsg {
    isErr: boolean;
    msg: string;
}

export type InitialValueMap = {
    // [ScDataTypeList.Text]: string;
    // [ScDataTypeList.Number]: number;
    // [ScDataTypeList.Password]: string;
    // [ScDataTypeList.Mobile]: string;
    // [ScDataTypeList.Email]: string;
    // [ScDataTypeList.Date]: string | Date;
    // [ScDataTypeList.DateTime]: string | Date;

    // [ScDataTypeList.Gender]: 0 | 1 | 2;
    // [ScDataTypeList.SwitchYesOrNo]: 0 | 1;
    // [ScDataTypeList.CheckYesOrNo]: 0 | 1;
    // [ScDataTypeList.SelectYesOrNo]: 0 | 1;

    // [ScDataTypeList.Person]: Person;
    // [ScDataTypeList.SimpDept]: SimpDept;
    // [ScDataTypeList.SimpCSC]: SimpCSC;
    // [ScDataTypeList.UserDefineCategory]: UserDefineCategory;
    // [ScDataTypeList.SimpEPC]: SimpEPC;
    // [ScDataTypeList.UserDefinedArchive]: UserDefinedArchive;
    // [ScDataTypeList.ExecutionProject]: ExecutionProject;
    // [ScDataTypeList.ConstructionSite]: ConstructionSite;
    // [ScDataTypeList.EPT]: EPT;
    // [ScDataTypeList.RiskLevel]: RiskLevel;
    // [ScDataTypeList.SimpDC]: SimpDC;
    // [ScDataTypeList.Position]: Position;
    // [ScDataTypeList.TC]: TC;
    // [ScDataTypeList.PPE]: PPE;

    [ScDataTypeList.AvatarUpload]: File;
    [ScDataTypeList.FileUpload]: VoucherFile[];
}

export interface BaseScInputProps {
    positionID: 0 | 1 | 2; // 0 Header  1 Body 2 Footer
    rowIndex: number;
    allowNull: boolean;
    isEdit: boolean;
    isBackendTest?: boolean;
    isMultiline?: boolean;
    rowNumber?: number;
    itemShowName?: string;
    itemKey: string;
    width?: number | string;
    height?: number;
    placeholder?:string;
    errInfo:ErrMsg;
    isOnSitePhoto?:boolean;
    markTexts?:MarkText[];
    onCancel: () => void;
}

export type PickDone<T extends keyof InitialValueMap> = (
    value: InitialValueMap[T],
    itemKey: string,
    positionID: 0 | 1 | 2,
    rowIndex: number,
    errMsg: ErrMsg
) => void;

export type BackendTest<T extends keyof InitialValueMap> = (
    value: InitialValueMap[T]
) => ErrMsg | Promise<ErrMsg>;

export type ScInputProps<T extends keyof InitialValueMap> = BaseScInputProps & {
    dataType: T;
    initValue: InitialValueMap[T];
    pickDone: PickDone<T>,
    backendTest?: BackendTest<T>
}

export type ScInputUnionProps = {
    [K in keyof InitialValueMap]: ScInputProps<K>
}[keyof InitialValueMap];

