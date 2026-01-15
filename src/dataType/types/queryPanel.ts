import { InitialValueMap } from "./scInput";
import { ScDataTypeList } from "./scDataType";
/* 
export type ScComparableType = keyof InitialValueMap;

export interface BaseComarison<T extends readonly ScComparableType[]> {
    id: string;
    label: string;
    value: string;
    applicable: T;
}

export interface InputComparison<T extends readonly ScComparableType[]> extends BaseComarison<T> {
    needInput: true;
    addCharacter: false;
}

export interface LikeComparison extends BaseComarison<readonly [ScDataTypeList.Text]> {
    needInput: true;
    addCharacter: true;
    addStart: string;
    addEnd: string;
}

export interface NullComparison<T extends readonly ScComparableType[]> extends BaseComarison<T> {
    needInput: false;
    addCharacter: false;
}

export type Comparison =
    | InputComparison<readonly ScComparableType[]>
    | LikeComparison
    | NullComparison<readonly ScComparableType[]>
 */

export interface Comparison {
    id: string;
    label: string;
    value: string;
    applicable: ScDataTypeList[];
    needInput: boolean;
    addCharacter: boolean;
    addStart: string;
    addEnd: string;
}
export interface QueryField<T extends keyof InitialValueMap> {
    id: number;
    value: string;
    label: string;
    inputType: T;
    resultField: string;
}

export interface Condition {
    logic: "and" | "or";
    compare: Comparison;
    field: QueryField<keyof InitialValueMap>;
    value: InitialValueMap[keyof InitialValueMap] | null;
    isNecessary: boolean;
}